<template>
  <div class="ma-5 d-flex flex-column align-center">
    <h1 class="mb-4 pt-2">Checkout form</h1>
    <form class="form-wrap">
      <h3 class="mb-4 font-weight-regular">Personal information</h3>
      <v-text-field
          ref="firstName"
          v-model="user.firstName"
          :error-messages="firstNameError"
          label="First Name"
          required
          @input="$v.user.firstName.$touch()"
          @blur="$v.user.firstName.$touch()"
          outlined
          dense
      ></v-text-field>
      <v-text-field
          ref="lastName"
          v-model="user.lastName"
          :error-messages="lastNameError"
          label="Last Name"
          required
          @input="$v.user.lastName.$touch()"
          @blur="$v.user.lastName.$touch()"
          outlined
          dense
      ></v-text-field>

      <h3 class="mb-4 font-weight-regular">Contact information</h3>
      <v-text-field
          ref="email"
          v-model="user.mail"
          placeholder="*******@****.***"
          :error-messages="emailError"
          label="Email"
          required
          @input="$v.user.mail.$touch()"
          @blur="$v.user.mail.$touch()"
          outlined
          dense
      ></v-text-field>
      <v-text-field
          ref="phone"
          v-model="phones.phone"
          placeholder="+380 (**) ** ** ***"
          :error-messages="phoneError"
          label="Phone number"
          required
          @input="$v.phones.phone.$touch()"
          @blur="$v.phones.phone.$touch()"
          outlined
          dense
      ></v-text-field>
      <div v-if="showPhone2" class="d-flex">
        <v-text-field
            ref="phone2"
            v-model="phones.phone2"
            placeholder="+380 (**) ** ** ***"
            :error-messages="phone2Error"
            label="Phone number"
            @input="$v.phones.phone2.$touch()"
            @blur="$v.phones.phone2.$touch()"
            outlined
            dense
        ></v-text-field>
        <v-btn icon @click="deletePhone('2')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      <div v-if="showPhone3" class="d-flex">
        <v-text-field
            ref="phone3"
            v-model="phones.phone3"
            placeholder="+380 (**) ** ** ***"
            :error-messages="phone3Error"
            label="Phone number"
            @input="$v.phones.phone3.$touch()"
            @blur="$v.phones.phone3.$touch()"
            outlined
            dense
        ></v-text-field>
        <v-btn icon @click="deletePhone('3')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <div class="d-flex justify-end">
        <v-btn @click="addPhone" :disabled="showPhone2 && showPhone3" text color="info" class="mb-7">
          Add phone
        </v-btn>
      </div>

      <v-select
          ref="country"
          v-model="user.country"
          :items="countryItems"
          :error-messages="countryError"
          label="Country"
          outlined
          dense
      ></v-select>
      <v-text-field
          ref="address"
          v-model="user.address"
          :error-messages="addressError"
          label="Address"
          required
          @input="$v.user.address.$touch()"
          @blur="$v.user.address.$touch()"
          outlined
          dense
      ></v-text-field>

      <h3 class="mb-4 font-weight-regular">Payment details</h3>
      <v-text-field
          ref="card"
          v-model="user.payment.card"
          placeholder="**** **** **** ****"
          :error-messages="cardError"
          :counter="16"
          label="Credit card"
          required
          @input="$v.user.payment.card.$touch()"
          @blur="$v.user.payment.card.$touch()"
          outlined
          dense
      ></v-text-field>
      <v-text-field
          ref="cvv2"
          v-model="user.payment.cvv2"
          placeholder="***"
          :error-messages="cvv2Error"
          :counter="3"
          label="CVV2 code"
          required
          @input="$v.user.payment.cvv2.$touch()"
          @blur="$v.user.payment.cvv2.$touch()"
          outlined
          dense
      ></v-text-field>

      <v-checkbox
          v-model="user.agreement"
          label="Agreement with terms of use"
          color="success"
          :error-messages="agreementErrors"
          required
          @change="$v.user.agreement.$touch()"
          @blur="$v.user.agreement.$touch()"
      ></v-checkbox>

      <v-btn
          class="mt-3"
          @click="submit"
          color="info"
          :loading="loading"
      >
        Submit
      </v-btn>
    </form>
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import {debounce} from '@/helpers/debounce'
import {isRequired, isString, isEmail, isMaxLength, isMinLength, isNumber} from '@/helpers/validation'
import {validationMixin} from 'vuelidate'
import {required, email, maxLength, minLength, numeric} from 'vuelidate/lib/validators'

export default {
  name: 'FormComponent',
  mixins: [validationMixin],

  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        mail: '',
        phone: [],
        country: '',
        address: '',
        payment: {
          card: '',
          cvv2: ''
        },
        agreement: false,
      },
      countryItems: ['Ukraine', 'USA', 'Poland'],
      phones: {
        phone: '',
        phone2: '',
        phone3: ''
      },
      showPhone2: false,
      showPhone3: false,
      loading: false,
      snackbar: false,
      snackbarText: '',
      timeout: 2000,
      asyncValidateError: ''
    }
  },

  validations: {
    phones: {
      phone: {required, numeric},
      phone2: {numeric},
      phone3: {numeric}
    },
    user: {
      firstName: {required},
      lastName: {required},
      mail: {email},
      country: {required},
      address: {required},
      payment: {
        card: {minLength: minLength(16), maxLength: maxLength(16), required},
        cvv2: {minLength: minLength(3), maxLength: maxLength(3), required}
      },
      agreement: {
        checked(val) {
          return val
        }
      }
    }
  },

  computed: {
    agreementErrors() {
      const errors = []
      if (!this.$v.user.agreement.$dirty) return errors
      !this.$v.user.agreement.checked && errors.push('You must agree to continue!')
      return errors
    },
    firstNameError() {
      return isRequired(this.$v.user.firstName) || isString(this.$v.user.firstName);
    },
    lastNameError() {
      return isRequired(this.$v.user.lastName) || isString(this.$v.user.lastName);
    },
    addressError() {
      return isRequired(this.$v.user.address);
    },
    phoneError() {
      return isRequired(this.$v.phones.phone) || isNumber(this.$v.phones.phone);
    },
    phone2Error() {
      return isNumber(this.$v.phones.phone2);
    },
    phone3Error() {
      return isNumber(this.$v.phones.phone3);
    },
    emailError() {
      return isEmail(this.$v.user.mail) || this.asyncValidateError;
    },
    countryError() {
      return isRequired(this.$v.user.country)
    },
    cardError() {
      return isRequired(this.$v.user.payment.card) || isMaxLength(this.$v.user.payment.card, 16) || isMinLength(this.$v.user.payment.card, 16)
    },
    cvv2Error() {
      return isRequired(this.$v.user.payment.cvv2) || isMaxLength(this.$v.user.payment.cvv2, 3) || isMinLength(this.$v.user.payment.cvv2, 3)
    }
  },

  methods: {
    asyncFormSend(user) {
      console.log('Log user...', user)
      return new Promise((resolve, reject) => {
        if (user.mail) {
          const randomNumber = Math.floor(Math.random() * 100);
          randomNumber < 75 ? resolve('Form successfully submit') : reject('Email validation failed');
        } else {
          resolve('Form successfully submit');
        }
      });
    },
    submit() {
      this.asyncValidateError = '';
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.user.phone = Object.values(this.phones).filter(phone => phone.trim() !== '');
        this.loading = true;
        debounce(this.sendForm, 1000)();
      } else {
        this.scrollToInvalid()
      }
    },
    scrollToInvalid() {
      const allFields = ['cvv2', 'card', 'address', 'country', 'phone3', 'phone2', 'phone', 'email', 'lastName', 'firstName'];
      let firstInvalid = null;
      allFields.forEach((name) => {
        this[`${name}Error`] ? firstInvalid = name : false;
      })
      this.$refs[firstInvalid].$el.scrollIntoView({behavior: 'smooth'});
    },
    sendForm() {
      this.asyncFormSend(this.user)
          .then((resolve) => {
            this.snackbarText = resolve;
          })
          .catch((reject) => {
            this.snackbarText = reject;
            this.asyncValidateError = reject;
          })
          .finally(() => {
            this.loading = false;
            this.snackbar = true;
          });
    },
    addPhone() {
      this.showPhone2 ? this.showPhone3 = true : this.showPhone2 = true;
    },
    deletePhone(num) {
      this[`showPhone${num}`] = false;
      this.phones[`phone${num}`] = ''
    }
  }
}
</script>

<style>
.form-wrap {
  width: 60%;
}
</style>
