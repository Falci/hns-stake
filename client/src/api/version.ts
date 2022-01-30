import { useAsync } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsyncFn';

interface Version {
  name: string;
  version: string;
}
export const useVersion = () =>
  useAsync(
    () => fetch('/api/version').then((r) => r.json()),
    []
  ) as AsyncState<Version>;
