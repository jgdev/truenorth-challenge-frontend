import { reactive, unref } from "vue";
import {
  FetchAction,
  PaginatedParams,
  PaginatedResult,
  ReqParams,
} from "../types";
import { authSession } from "../api";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const createFetchAction = <T, K = any>(
  apiEndpoint: string,
  defaultValue?: T,
  transform?: {
    response?: (body: any) => any;
    url?: (url: string, options?: ReqParams<K>) => string;
  }
): FetchAction<T, K> => {
  const state = reactive({
    result: defaultValue,
    error: undefined,
  }) as FetchAction<T, K>;

  const fetchAction = (defaultOptions: RequestInit) => {
    return async (options?: ReqParams<K>): Promise<void> => {
      const requestOptions: RequestInit = {
        ...defaultOptions,
        ...options,
      };

      requestOptions.headers = {
        ...(requestOptions.headers || {}),
        ...(authSession.result && {
          "X-Session-Id": authSession.result,
        }),
      };

      state.loading = true;

      let url = apiUrl + apiEndpoint;
      url = transform?.url ? transform.url(url, options) : url;

      const querystring =
        options?.querystring &&
        new URLSearchParams(options?.querystring).toString();

      return fetch(`${url}${(querystring && "?" + querystring) || ""}`, {
        ...requestOptions,
        ...(options?.data && {
          body: JSON.stringify(options.data),
          headers: {
            ...(requestOptions.headers || {}),
            "Content-Type": "application/json",
          },
        }),
      })
        .then(async (res) => {
          const body = await res.json();
          if (!res.ok) return Promise.reject(body);
          return body as K;
        })
        .then(({ result }: any) => {
          state.result =
            (transform?.response && transform.response(result)) || result;
          return result;
        })
        .catch((err) => {
          state.error = err;
          return Promise.reject(err);
        })
        .finally(() => {
          state.loading = false;
        });
    };
  };

  state.delAction = fetchAction({ method: "DELETE" });
  state.postAction = fetchAction({ method: "POST" });
  state.getAction = fetchAction({ method: "GET" });

  return unref(state);
};

export const createFetchResourcesAction = <T>(
  apiEndpoint: string,
  transform?: {
    response?: (body: any) => any;
  }
): FetchAction<PaginatedResult<T>> => {
  const state = createFetchAction<PaginatedResult<T>, PaginatedParams>(
    apiEndpoint,
    {
      result: [],
      limit: 0,
      searchParams: undefined,
      skip: 0,
    },
    transform
  );

  return state;
};
