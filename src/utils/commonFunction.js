import { isEmpty } from 'lodash';
import { Keyboard } from 'react-native';
import { API_BASE_URL } from '../config/urls';
import { openCamera, openPicker } from './imagePicker';
import imagePath from '../constants/imagePath';
import moment from 'moment';

const cameraHandler = async (data, option) => {
  Keyboard.dismiss();
  //this condition use for open camera
  if (data == 0) {
    let options = {
      ...option,
    };
    try {
      const res = await openCamera(options);
      if (res) {
        return res;
      }
    } catch (err) {
      console.log(err, 'err');
    }
  }
  //this condition use for open gallery
  else if (data == 1) {
    let options = {
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.5,
      cropperCircleOverlay: true,
      ...option,
    };
    try {
      const res = await openPicker(options);
      // if (res && (res.sourceURL || res.path)) {
      //   // return Platform.OS == 'ios' ? res.data : res.path;
      //   return res
      // }
      if (res) {
        return res;
      }
    } catch (err) {
      console.log(err, 'err');
    }
  } else {
    return null;
  }
};



const cameraImgVideoHandler = async (data, options) => {
  Keyboard.dismiss();
  //this condition use for open camera
  if (data == 0) {

    try {
      const res = await openCamera({ ...options });
      if (res) {
        return res;
      }
    } catch (err) {
      console.log(err, 'err');
    }
  }
  //this condition use for open gallery
  else if (data == 1) {
    try {
      const res = await openPicker({ ...options });
      if (res) {
        return res;
      }
    } catch (err) {
      console.log(err, 'err');
    }
  } else {
    return null;
  }
};

const toFixed = (n, fixed) => {
  if (n > 0 && fixed > 0) {
    // return `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))[0];
    return Number(n).toFixed(fixed);
  } else return Math.trunc(n);
};

const commaFormater = (num) => {
  return num.toString().replace(/^[+-]?\d+/, function (int) {
    return int.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  });
};
const currencyNumberFormatter = (number, digitAfterDecimal = 2) => {
  let newFormatedDecimalNumber = toFixed(number, digitAfterDecimal);
  return commaFormater(newFormatedDecimalNumber);
};

export function getImageUrl(url1, url2, dimentions) {
  // console.log(`${url1}${dimentions}${url2}`, "Url")
  return `${url1}${dimentions}${url2}`;
}


export function getImageUrlNew({
  url = '',
  image_const_arr = '',
  type = "image_fit",
  height = "260",
  width = "260",
}) {
  const values = image_const_arr[type];
  let return_url = `${values}${height}/${width}${image_const_arr['proxy_url']}/${image_const_arr['s3_url']}${url}@webp`;
  return return_url;
}

export const ifDataExist = (data) => {
  if (data && data !== null) {
    return true;
  }
  return false;
};

export const getSubDomain = () => {
  return API_BASE_URL.split('/')[3];
};

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function dateParser(dateString) {
  const newDt = Date.parse(dateString);
  if (!isNaN(newDt)) {
    return dateString;
  } else null;
}

export const getValuebyKeyInArray = (key = '', data) => {
  if (!isEmpty(data)) {
    let obj = data?.find((o) => o?.key_name === key);
    if (obj?.key_value != 0) {
      return obj?.key_value;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

export const addRemoveMinutes = (numMinutes, date = new Date(), type = '+') => {
  if (type == '+') {
    return new Date(date.getTime() + numMinutes * 60000);
  } else {
    return new Date(date.getTime() - numMinutes * 60000);
  }
};

export const getHourAndMinutes = (numMinutes) => {
  let minutes = numMinutes % 60;
  let hours = Math.floor(numMinutes / 60);
  return `${hours} hour ${minutes} min`;
};

export const countDecimals = (value) => {
  if (value.includes('.')) {
    return value.split('.')[1].length;
  } else {
    return 0;
  }
};

export const tokenConverterPlusCurrencyNumberFormater = (
  price = 0,
  digitAfterDecimal = 0,
  additionalPreferences = {},
  currencySymbol = '',
) => {
  if (getValuebyKeyInArray('is_token_currency_enable', additionalPreferences)) {
    let tokenCurrency = getValuebyKeyInArray(
      'token_currency',
      additionalPreferences,
    );

    // let tokenCurrency = 2;
    return currencyNumberFormatter(
      Number(price) * tokenCurrency,
      digitAfterDecimal,
    );
  } else {
    return `${currencySymbol} ${currencyNumberFormatter(
      Number(price),
      digitAfterDecimal,
    )}`;
  }
};

export const checkValueExistInAry = (item = {}, arr2 = []) => {
  let found = arr2.includes(item?.id);
  return found;
};

export const getCardImage = (brand) => {
  return brand == "Visa" ? imagePath.icVisaCard :
    brand == "MasterCard" ? imagePath.icMasterCard :
      brand == "JCB" ? imagePath.icJcbCard :
        brand == "Discover" ? imagePath.icDiscoverCard :
          brand == "DinersClub" ? imagePath.icDinersClubCard :
            brand == "UnionPay" ? imagePath.icUnionPay :
              brand == "American Express" ? imagePath.icAmericanExpressCard :
                imagePath.icUnknownCard
}

export const getDaysFormat = (date = new Date()) => {
  const createdAt = moment(date);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');
  let groupLabel = '';

  if (createdAt.isSame(today, 'd')) {
    return groupLabel = 'Today';
  } else if (createdAt.isSame(yesterday, 'd')) {
    return groupLabel = 'Yesterday';
  } else {
    return groupLabel = createdAt.format('MMM D, YYYY');
  }
}

export const numberFormate = (value) => {
  if (value != undefined || value != null) {
    return Number(value)
  }
  return 0
}
export const numberOfArraySum = (value = []) => {
  let sum = 0;
  value.forEach(num => {
    if (typeof num == 'undefined') {
      sum = 0;
    } else {
      sum += Number(num)
    }
  });
  return sum;
};
export const getSomeDataFromArray = (key, array) => {
  let data = []
  array.map((item) => {
    if (key.includes(item.key_name || item.title)) {
      data.push(item)
    }
  })
  console.log(data, 'arrayarrayarrayarray');

  return data
}


export { cameraHandler, currencyNumberFormatter, cameraImgVideoHandler };
