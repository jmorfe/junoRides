import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {getBundleId} from 'react-native-device-info';
import {MaterialIndicator} from 'react-native-indicators';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {moderateScale} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import {getCurrentLocation, showError} from '../../utils/helperFunctions';
import {chekLocationPermission} from '../../utils/permissions';
import {getColorSchema, getItem} from '../../utils/utils';
import {IRootState} from './interfaces';
import styles from './styles';
import {getAppCode} from './getAppCode';

interface locationInterface {
  latitude: number;
  longitude: number;
  address: string;
}

const ShortCode: FC = () => {
  const {deepLinkUrl, auth, themeColor, themeToggle} = useSelector(
    (state: IRootState) => state?.initBoot || {},
  );
  const theme = themeColor;
  const toggleTheme = themeToggle;
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let apiRes: any = useRef(null); // we using useRef to get latest values immediately

  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    chekLocationPermission(true)
      .then(result => {
        if (result !== 'goback' && result == 'granted') {
          getCurrentLocation('home')
            .then(curLoc => {
              initApiHit(curLoc);
              return;
            })
            .catch(err => {
              initApiHit({});
              return;
            });
        } else {
          initApiHit({});
          return;
        }
      })
      .catch(error => {
        initApiHit({});
      });
  }, []);

  const initApiHit = async (locData: locationInterface | {}) => {
    const lang = await getItem('setPrimaryLanguage');
    const prevCode = await getItem('saveShortCode');
    const appCode = !!prevCode ? prevCode : getAppCode();

    let header = {};

    if (!!lang?.primary_language?.id) {
      header = {
        code: appCode,
        language: lang?.primary_language?.id,
      };
    } else {
      header = {
        code: appCode,
      };
    }

    actions
      .initApp(locData, header, false, null, null, true)
      .then(res => {
        console.log('header response--->', res);
        actions.saveShortCode(appCode);
        apiRes = res; // save response in reference to get the latest value immediately
        setLoadingScreen(false);
        navigateToNextScreen(res);
      })
      .catch(error => {
        setTimeout(() => {
          showError(error?.message || error?.error);
        }, 500);
      });
  };
  const navigateToNextScreen = useCallback(
    (res: any) => {
      getItem('firstTime').then(el => {
        if (!el && !!res?.data && res?.data?.dynamic_tutorial.length > 0) {
          actions.setAppSessionData('app_intro');
        } else {
          if (!!auth?.userData && !!auth?.userData?.auth_token) {
            actions.setAppSessionData('guest_login');
          } else if (deepLinkUrl && !auth?.userData?.auth_token) {
            actions.setAppSessionData('on_login');
          } else {
            actions.setAppSessionData('guest_login');
          }
        }
      });
    },
    [auth, deepLinkUrl],
  );
  const _renderSplash = useCallback(() => {
    switch (getBundleId()) {
      case appIds?.masa:
        return animatedSplash(); // showing video splash
      default:
        return imageSplash();
    }
  }, []);
  const animationVideo = useCallback(() => {
    // showing video splash
    switch (getBundleId()) {
      case appIds?.masa:
        return imagePath.masa;
    }
  }, []);
  const imageSplash = useCallback(() => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.splashStyle}>
          <View style={{position: 'absolute', bottom: moderateScale(100)}}>
            {loadingScreen && (
              <MaterialIndicator size={50} color={colors.greyMedium} />
            )}
          </View>
        </View>
        <Image source={{uri: 'Splash'}} style={{flex: 1, zIndex: -1}} />
      </View>
    );
  }, [loadingScreen]);

  const animatedSplash = () => {
    return (
      <View style={styles.videoView}>
        <Video
          source={animationVideo()}
          style={styles.videoStyle}
          resizeMode={'cover'}
          onEnd={onVideoDurationEnded}
          muted={true}
        />
      </View>
    );
  };
  const onVideoDurationEnded = useCallback(() => {
    checkNavigationState(true);
  }, []);
  const checkNavigationState = (videoEnd: boolean) => {
    if (videoEnd) {
      navigateToNextScreen(apiRes);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      {_renderSplash()}
    </View>
  );
};

export default ShortCode;
