import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';
import Loader from './Loader';


const WrapperContainer = ({
  children,
  isLoading = false,
  bgColor = colors.white,
  statusBarColor = colors.white,
  barStyle = 'dark-content',
  withModal = false,
  isSafeArea = true
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;


  if(isSafeArea){
    return(
      <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : statusBarColor,
      }}>
      <StatusBar
        backgroundColor={
          isDarkMode ? MyDarkTheme.colors.background : statusBarColor
        }
        barStyle={isDarkMode ? 'light-content' : barStyle}
      />
      <View style={{ backgroundColor: bgColor, flex: 1 }}>{children}</View>
      <Loader isLoading={isLoading} withModal={withModal} />
    </SafeAreaView>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : statusBarColor,
      }}>
      <StatusBar
        backgroundColor={
          isDarkMode ? MyDarkTheme.colors.background : statusBarColor
        }
        barStyle={isDarkMode ? 'light-content' : barStyle}
      />
      <View style={{ backgroundColor: bgColor, flex: 1 }}>{children}</View>
      <Loader isLoading={isLoading} withModal={withModal} />
    </View>
  );
};

export default React.memo(WrapperContainer);
