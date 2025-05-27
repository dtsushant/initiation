import { createHttpBase } from '/@/utils/httpBaseUtils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ApiCallProps<TRequest = unknown, TResponse = unknown> {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  payload?: TRequest;
  queryParams?:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: unknown) => void;
}

function useApiCall<TRequest = unknown, TResponse = unknown>({
  endpoint,
  method,
  payload,
  queryParams,
  onSuccess,
  onError,
}: ApiCallProps<TRequest, TResponse>)  {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [refetch, setRefetch] = useState(false);
  const navigate = useNavigate();

  const makeApiCall =  async (bodyPayload?: TRequest): Promise<TResponse | void> => {
    setLoading(true);
    setError('');
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const api = createHttpBase(false, signal, navigate, endpoint);

      let finalEndpoint = endpoint;

      if (queryParams) {
        const queryString = new URLSearchParams(queryParams).toString();
        finalEndpoint += `?${queryString}`;
      }

      const apiMethods: Record<string, () => Promise<any>> = {
        GET: () => api.get(finalEndpoint),
        POST: () => api.post(finalEndpoint, bodyPayload),
        PUT: () => api.put(finalEndpoint, bodyPayload),
        DELETE: () => api.delete(finalEndpoint),
      };

      const res = await apiMethods[method]();

      if (res.status === 200 || res.status === 201) {
        setResponse(res.data);
        if (onSuccess) onSuccess(res.data);
        return res.data as TResponse;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.response?.data?.message || 'An error occurred');
      if (onError) onError(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (endpoint && (method === 'GET' || payload)) {
      makeApiCall(payload);
    }
  }, [endpoint, payload, queryParams, refetch]);

  return { loading, response, error, refetch: () => setRefetch(!refetch),makeApiCall };
}

export default useApiCall;
