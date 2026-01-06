import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import Header from '../../Components/Header'
import HeaderLoader from '../../Components/Loaders/HeaderLoader'
import WrapperContainer from '../../Components/WrapperContainer'
import imagePath from '../../constants/imagePath'
import strings from '../../constants/lang'
import colors from '../../styles/colors'
import { moderateScale, moderateScaleVertical, width } from '../../styles/responsiveSize'
import { MyDarkTheme } from '../../styles/theme'
import { getColorSchema } from '../../utils/utils'

const ReviewBookingShimmerLoader = () => {
    const darkthemeusingDevice = getColorSchema();
    const {
        themeColor,
        themeToggle,
      } = useSelector(state => state?.initBoot);
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  return (
    <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
      >
             <Header
        centerTitle={strings.REVIEW_BOOKING}
        leftIcon={imagePath.icBackb}

        // onPressRightTxt={() => openClearCartModal()}
        // onPressLeft={() => navigation.navigate(navigationStrings.HOMESTACK)}
      />

        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
            }}
            isRight={false}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            heightLeft={15}
            rectHeightLeft={15}
            isRight={false}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
              alignSelf: 'center',
            }}

          // resizeMode="contain"s
          />

          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(30),
            }}
          />
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(8),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(90)}
            rectWidthLeft={width - moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(20),
            }}
            isRight={false}
          />
          <View style={{ flexDirection: 'row' }}>
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(15),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
          </View>
          <HeaderLoader
            widthLeft={moderateScale(90)}
            rectWidthLeft={moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={moderateScale(40)}
            rectHeightLeft={moderateScale(40)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
            isRight={false}
          />
        </ScrollView>
      </WrapperContainer>
  )
}

export default ReviewBookingShimmerLoader

const styles = StyleSheet.create({})