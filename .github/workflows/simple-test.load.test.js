import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '60s',
};

export default function () {
  const response = http.get(__ENV.BASE_URL + '/posts/1');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  sleep(1);
}
