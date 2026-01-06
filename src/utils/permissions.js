import { useNavigation } from '@react-navigation/native';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import strings from '../constants/lang';
import { showError } from './helperFunctions';
import { openAppSetting } from './openNativeApp';
import { err } from 'react-native-svg/lib/typescript/xml';

export const androidCameraPermission = () =>
  new Promise(async (resolve, reject) => {

    try {

      if (Platform.OS === "android" && Platform.Version > 22) {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.requestMultiple([
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          ]);
          if (
            granted["android.permission.CAMERA"] !== "granted" ||
            granted["android.permission.READ_MEDIA_IMAGES"] !== "granted"
          ) {
            Alert.alert(
              "Alert",
              "Don't have permission to open camera",
              [{ text: "Okay" }],
              { cancelable: true }
            );
            return resolve(false);
            // alert(strings.DO_NOT_HAVE_PERMISSIONS_TO_SELECT_IMAGE);
          }
        } else {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ]);
          if (
            granted["android.permission.CAMERA"] !== "granted" ||
            granted["android.permission.WRITE_EXTERNAL_STORAGE"] !== "granted" ||
            granted["android.permission.READ_EXTERNAL_STORAGE"] !== "granted"
          ) {
            Alert.alert(
              "Alert",
              "Don't have permission to open camera",
              [{ text: "Okay" }],
              { cancelable: true }
            );
            return resolve(false);
            // alert(strings.DO_NOT_HAVE_PERMISSIONS_TO_SELECT_IMAGE);
          }
        }
        return resolve(true);
      }

      return resolve(true);
    } catch (error) {
      return resolve(false);
    }
  });



export const locationPermission = () =>
  new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        const permissionStatus = await Geolocation.requestAuthorization(
          'whenInUse',
        );
        if (permissionStatus === 'granted') {
          return resolve('granted');
        }
        reject('Permission not granted');
      } catch (error) {
        return reject(error);
      }
    } else {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then((granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //console.log('You can use the location');
            return resolve('granted');
          }
          //console.log('Location permission denied');
          else {
            return reject('Location permission denied');
          }
        })
        .catch((error) => {
          console.log('Ask Location permission error: ', error);
          return reject(error);
        });
    }
  });

export const chekLocationPermission = (showAlert = true) =>
  new Promise(async (resolve, reject) => {
    try {
      check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      )
        .then((result) => {
          console.log("permission result", result)
          switch (result) {
            case RESULTS.UNAVAILABLE:
              showError(strings.LOCATION_UNAVAILABLE);
              break;
            case RESULTS.DENIED:
              request(
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                  : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              )
                .then((result) => {
                  if (result == "blocked") {
                    if (showAlert) {
                      Alert.alert('', strings.LOCATION_DISABLED_MSG, [
                        {
                          text: strings.CANCEL,
                          onPress: () => resolve('goback'),
                        },
                        {
                          text: strings.CONFIRM,
                          onPress: () => {
                            const locationPath = 'LOCATION_SERVICES';
                            openAppSetting(locationPath);
                          },
                        },
                      ]);
                    }
                  }
                  return resolve(result);
                })
                .catch((error) => {
                  return reject(error);
                });

              break;
            case RESULTS.LIMITED:
              showError(strings.LOCATION_LIMITED);
              break;
            case RESULTS.GRANTED:
              return resolve(result);
            case RESULTS.BLOCKED:
              if (showAlert) {
                Alert.alert('', strings.LOCATION_DISABLED_MSG, [
                  {
                    text: strings.CANCEL,
                    onPress: () => resolve('goback'),
                  },
                  {
                    text: strings.CONFIRM,
                    onPress: () => {
                      const locationPath = 'LOCATION_SERVICES';
                      openAppSetting(locationPath);
                    },
                  },
                ]);
              }
              return resolve(result);
          }
        })
        .catch((error) => {
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });


export const checkContactPermission = () => {
  return new Promise(async (resolve, reject) => {
    try {
      check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS,
      )
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              showError(strings.LOCATION_UNAVAILABLE);
              break;
            case RESULTS.DENIED:
              request(
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.CONTACTS
                  : PERMISSIONS.ANDROID.READ_CONTACTS,
              )
                .then((result) => {
                  return reject(result);
                })
                .catch((error) => {
                  return reject(error);
                });

              break;
            case RESULTS.LIMITED:
              showError('The permission is limited: some actions are possible');
              break;
            case RESULTS.GRANTED:
              return resolve(result);
            case RESULTS.BLOCKED:
              Alert.alert('', 'Contact permission permanantly disabled!!', [
                {
                  text: strings.CANCEL,
                  onPress: () => console.log('Cancle pressed'),
                },
                {
                  text: strings.CONFIRM,
                  onPress: () => {
                    // const locationPath = 'LOCATION_SERVICES';
                    // openAppSetting(locationPath);
                    console.log('Confirm pressed');
                  },
                },
              ]);

              return reject(result);
          }
        })
        .catch((error) => {
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });
};

export const checkCameraAndGallaryPermision = () => {
  return new Promise(async (resolve, reject) => {
    try {
      checkMultiple(
        Platform.OS === 'ios'
          ? [PERMISSIONS.IOS.CAMERA]
          : [
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          ],
      )
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              showError(strings.LOCATION_UNAVAILABLE);
              break;
            case RESULTS.DENIED:
              requestMultiple(
                Platform.OS === 'ios'
                  ? [PERMISSIONS.IOS.CAMERA]
                  : [
                    PERMISSIONS.ANDROID.CAMERA,
                    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                  ],
              )
                .then((result) => {
                  return reject(result);
                })
                .catch((error) => {
                  return reject(error);
                });

              break;
            case RESULTS.LIMITED:
              showError('The permission is limited: some actions are possible');
              break;
            case RESULTS.GRANTED:
              return resolve(result);
            case RESULTS.BLOCKED:
              Alert.alert('', 'Contact permission permanantly disabled!!', [
                {
                  text: strings.CANCEL,
                  onPress: () => console.log('Cancle pressed'),
                },
                {
                  text: strings.CONFIRM,
                  onPress: () => {
                    // const locationPath = 'LOCATION_SERVICES';
                    // openAppSetting(locationPath);
                    console.log('Confirm pressed');
                  },
                },
              ]);

              return reject(result);
          }
        })
        .catch((error) => {
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });
};



export const bluetoothPermission = () =>
  new Promise(async (resolve, reject) => {

    try {
      if (Number(Platform.constants.Release) <= Number(11)) {
        return resolve(true)
      }
      else {
        const granted = await PermissionsAndroid.requestMultiple(
          [PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,],
          {
            title: 'Bluetooth Scanning Permission',
            message: 'Allow this app to Bluetooth Scan?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log(granted, 'grantedgrantedgrantedgranted>>>>>');
        if (
          granted['android.permission.BLUETOOTH_SCAN'] == 'granted' &&
          granted['android.permission.BLUETOOTH_CONNECT'] == 'granted'

        ) {
          return resolve('grant')
        }
        else {
          return resolve('denied')
        }
      }
    }
    catch (error) {
      return reject(error);
    }
  })

export const onlyCheckLocationPermission = (showAlert = true) =>
  new Promise(async (resolve, reject) => {
    try {
      check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      )
        .then((result) => {
          if (result === "granted") {
            return resolve(result)
          }
          else {
            return reject(result);
          }
        })
        .catch((error) => {
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });

  export const requestRecordAudioPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const permissionStatus = await check(PERMISSIONS.IOS.MICROPHONE);
        if (permissionStatus === RESULTS.DENIED|| permissionStatus === RESULTS.BLOCKED) {
          const requestResult = await request(PERMISSIONS.IOS.MICROPHONE);
          if (requestResult === RESULTS.GRANTED) {
            console.log('iOS microphone permission granted');
            return true;
          } else {
            console.log('iOS microphone permission denied');
            showOpenSettingsAlert();
            return false;
          }
        } else {
          console.log('iOS microphone permission already granted');
          return true;
        }
      } else if (Platform.OS === 'android') {
        if (Platform.Version >= 23) {
          const permissionResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );
          if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Android record audio permission granted');
            return true;
          } else {
            console.log('Android record audio permission denied');
            showOpenSettingsAlert();
            return false;
          }
        } else {
          console.log('Android version is below 23, permission is granted by default');
          return true;
        }
      } else {
        console.log('Unsupported platform');
        return false;
      }
    } catch (error) {
      console.error('Error requesting audio permission:', error);
      return false;
    }
  };
  
  const showOpenSettingsAlert = () => {
    Alert.alert(
      'Permission Required',
      'Please grant permission to record audio in your device settings',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings(),
        },
      ],
      { cancelable: false }
    );
  };
  