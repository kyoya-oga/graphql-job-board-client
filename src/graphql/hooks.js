import { useMutation, useQuery } from '@apollo/client';
import { getAccessToken } from '../auth';
import {
  COMPANY_QUERY,
  CREATE_JOB_MUTATION,
  JOBS_QUERY,
  JOB_QUERY,
} from './queries';

export function useJob(id) {
  const { data, loading, error } = useQuery(JOB_QUERY, {
    variables: { id },
  });
  return { job: data?.job, loading, error: Boolean(error) };
}

export function useCreateJob() {
  const [mutate, { loading, error }] = useMutation(CREATE_JOB_MUTATION);

  return {
    createJob: async (title, description) => {
      const {
        data: { job },
      } = await mutate({
        variables: { input: { title, description } },
        context: { headers: { Authorization: `Bearer ${getAccessToken()}` } },
        // 不要なリクエストを回避するためにキャッシュを更新する
        update: (cache, { data: { job } }) => {
          cache.writeQuery({
            query: JOB_QUERY,
            variables: { id: job.id },
            data: { job },
          });
        },
      });
      return job;
    },
    loading,
    error: Boolean(error),
  };
}

export function useJobs() {
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export function useCompany(companyId) {
  const { data, loading, error } = useQuery(COMPANY_QUERY, {
    variables: { companyId },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}
