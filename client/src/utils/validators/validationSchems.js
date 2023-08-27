import * as yup from 'yup';
import valid from 'card-validator';

export default {
  LoginSchem: yup.object().shape({
    email: yup.string().email('check email').required('required'),
    password: yup
      .string()
      .test(
        'test-password',
        'min 6 symbols',
        value => value && value.trim().length >= 6
      )
      .required('required'),
  }),
  RegistrationSchem: yup.object().shape({
    email: yup.string().email('check email').required('Email is required'),
    password: yup
      .string()
      .test(
        'test-password',
        'min 6 symbols',
        value => value && value.trim().length >= 6
      )
      .required('required'),
    confirmPassword: yup
      .string()
      .required('confirm password is required')
      .oneOf([yup.ref('password')], 'confirmation pass must match password'),
    firstName: yup
      .string()
      .test(
        'test-firstName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('First Name is required'),
    lastName: yup
      .string()
      .test(
        'test-lastName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('Last Name is required'),
    displayName: yup
      .string()
      .test(
        'test-displayName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('Display Name is required'),
    role: yup
      .string()
      .matches(/(customer|creator|moderator)/)
      .required('Role is required'),
    agreeOfTerms: yup
      .boolean()
      .oneOf([true], 'Must Accept Terms and Conditions')
      .required('Must Accept Terms and Conditions'),
  }),
  ContestSchem: yup.object({
    nameVenture: yup.string().when('contestType', {
      is: 'name',
      then: yup.string().min(3),
      otherwise: yup.string().min(3).required('required'),
    }),
    contestType: yup
      .string()
      .matches(/(name|tagline|logo)/)
      .required(),
    title: yup
      .string()
      .test(
        'test-title',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('title of contest required'),
    industry: yup.string().required('industry required'),
    focusOfWork: yup
      .string()
      .test(
        'test-focusOfWork',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('focus of work required'),
    targetCustomer: yup
      .string()
      .test(
        'test-targetCustomer',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('target customers required'),
    styleName: yup.string().min(1),
    typeOfName: yup.string().min(1),
    typeOfTagline: yup.string().min(1),
    brandStyle: yup.string().min(1),
    file: yup.mixed(),
  }),
  filterSchem: yup.object().shape({
    typeIndex: yup.number().oneOf[(1, 2, 3, 4, 5, 6, 7)],
    contestId: yup.string(),
    awardSort: yup.string().matches(/(desc|asc)/),
    industry: yup.string(),
  }),
  LogoOfferSchema: yup.object().shape({
    offerData: yup
      .mixed()
      .test('test-file', 'Support only images *.png, *.gif, *.jpeg', value => {
        if (!value) return false;
        return (
          value.type === 'image/png' ||
          value.type === 'image/jpeg' ||
          value.type === 'image/gif'
        );
      })
      .required('required'),
  }),
  TextOfferSchema: yup.object().shape({
    offerData: yup
      .string()
      .test(
        'test-offerData',
        'required',
        value => value && value.trim().length >= 1 && value.trim().length <= 64
      )
      .required('suggestion is required'),
  }),
  PaymentSchema: yup.object().shape({
    number: yup
      .string()
      .test(
        'test-cardNumber',
        'Credit Card number is invalid',
        value => valid.number(value).isValid
      )
      .required('required'),
    name: yup
      .string()
      .min(1, 'required atleast one symbol')
      .required('required'),
    cvc: yup
      .string()
      .test('test-cvc', 'cvc is invalid', value => valid.cvv(value).isValid)
      .required('required'),
    expiry: yup
      .string()
      .test(
        'test-expiry',
        'expiry is invalid',
        value => valid.expirationDate(value).isValid
      )
      .required('required'),
  }),
  CashoutSchema: yup.object().shape({
    sum: yup.number().min(5, 'min sum is 5$').required('required'),
    number: yup
      .string()
      .test(
        'test-cardNumber',
        'Credit Card number is invalid',
        value => valid.number(value).isValid
      )
      .required('required'),
    name: yup.string().min(1).required('required'),
    cvc: yup
      .string()
      .test('test-cvc', 'cvc is invalid', value => valid.cvv(value).isValid)
      .required('required'),
    expiry: yup
      .string()
      .test(
        'test-expiry',
        'expiry is invalid',
        value => valid.expirationDate(value).isValid
      )
      .required('required'),
  }),
  UpdateUserSchema: yup.object().shape({
    firstName: yup
      .string()
      .test(
        'test-firstName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
    lastName: yup
      .string()
      .test(
        'test-lastName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
    displayName: yup
      .string()
      .test(
        'test-displayName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
    file: yup
      .mixed()
      .test('test-file', 'Support only images *.png, *.gif, *.jpeg', value => {
        if (!value) return false;
        return (
          value.type === 'image/png' ||
          value.type === 'image/jpeg' ||
          value.type === 'image/gif'
        );
      }),
  }),
  MessageSchema: yup.object({
    message: yup
      .string()
      .test(
        'test-message',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
  }),
  CatalogSchema: yup.object({
    catalogName: yup
      .string()
      .test(
        'test-catalogName',
        'required',
        value => value && value.trim().length >= 1
      )
      .required('required'),
  }),
  EventSchema: yup.object().shape({
    name: yup.string().trim().min(2).max(64).required('required'),
    date: yup
      .date()
      .test('is-date-valid', 'Date must be today or later', date => {
        const today = new Date().setHours(0, 0, 0, 0);
        const selectedDate = new Date(date).setHours(0, 0, 0, 0);
        return selectedDate >= today;
      })
      .required('required'),
    time: yup.string().when('date', {
      is: date => {
        const today = new Date().setHours(0, 0, 0, 0);
        const selectedDate = new Date(date).setHours(0, 0, 0, 0);
        return selectedDate === today;
      },
      then: yup
        .string()
        .test('is-time-valid', 'Time must be later than now', time => {
          if (time) {
            const currentTime = new Date();
            const [hours, minutes] = time.split(':');
            const selectedTime = new Date();
            selectedTime.setHours(Number(hours), Number(minutes), 0, 0);
            return selectedTime > currentTime;
          } else {
            return false;
          }
        })
        .required('required'),
      otherwise: yup.string().required('required'),
    }),
    daysNotify: yup
      .number('Value must be a number')
      .min(0, 'Value must be at least 0')
      .required('required'),
    hoursNotify: yup
      .number('Value must be a number')
      .min(0, 'Value must be at least 0')
      .required('required'),
    minutesNotify: yup
      .number('Value must be a number')
      .min(0, 'Value must be at least 0')
      .max(60, 'Value must be at most 60')
      .required('required'),
    secondsNotify: yup
      .number('Value must be a number')
      .min(0, 'Value must be at least 0')
      .max(60, 'Value must be at most 60')
      .required('required'),
  }),
};
