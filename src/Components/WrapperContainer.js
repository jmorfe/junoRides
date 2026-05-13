import React from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';
import Loader from './Loader';
import { useSelector } from 'react-redux';
import { MyDarkTheme } from '../styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WrapperContainer = ({
  children,
  isLoading = false,
  bgColor = colors.white,
  statusBarColor = colors.white,
  barStyle = 'dark-content',
  withModal = false,
  isSafeArea = true,
  isMainWrapper = true,
  isTabVisible = true,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const isDarkMode = theme;
  const inset = useSafeAreaInsets();

  const isAndroid35Plus = Platform.OS === 'android' && Platform.constants.Version >= 35;
  const topMargin = isAndroid35Plus && isMainWrapper ? StatusBar.currentHeight : 0;
  // inset.bottom is 0 on devices that don't need it, so no need to restrict by OS version
  const bottomPadding = !isTabVisible ? inset.bottom : 0;

  const bgStyle = { backgroundColor: isDarkMode ? MyDarkTheme.colors.background : statusBarColor };
  const innerStyle = { backgroundColor: bgColor, flex: 1, marginTop: topMargin, paddingBottom: bottomPadding };

  if (isSafeArea) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, ...bgStyle }}>
        <StatusBar
          backgroundColor={isDarkMode ? MyDarkTheme.colors.background : statusBarColor}
          barStyle={isDarkMode ? 'light-content' : barStyle}
        />
        <View style={innerStyle}>{children}</View>
        <Loader isLoading={isLoading} withModal={withModal} />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, ...bgStyle }}>
      <StatusBar
        backgroundColor={isDarkMode ? MyDarkTheme.colors.background : statusBarColor}
        barStyle={isDarkMode ? 'light-content' : barStyle}
      />
      <View style={innerStyle}>{children}</View>
      <Loader isLoading={isLoading} withModal={withModal} />
    </View>
  );
};

export default React.memo(WrapperContainer);
