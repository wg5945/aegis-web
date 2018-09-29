const api_helper = require('../src/library/utils/api_helper').default;

const HttpMethod = require('../src/library/bean/method');
const apiDef = {
  user: {
    url: '/management/metrics',
    method: HttpMethod.GET
  },
  user2: {
    url: '/management/metrics2',
    method: HttpMethod.GET
  }
};
const api = api_helper(apiDef, {
  basePath: 'https://test.os.aegis-info.com',
  pathSuffix: '',
  defaultErrorHandler: () => {
    console.log('a');
  },
  requestErrorHandler: () => {
    console.log('b');
  }
});

api.user2.req().then((a) => {
  console.log(a.data);
}).catch(err => {
  console.log(2);
});

