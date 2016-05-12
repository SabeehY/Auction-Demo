import memoize from 'lru-memoize';
import {createValidator, required, email, phone} from 'utils/validation';

const signupValidation = createValidator({
  username: required,
  company: required,
  email: [required, email],
  phone: [required, phone]
});
export default memoize(10)(signupValidation);
