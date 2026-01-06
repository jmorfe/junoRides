import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { CalendarList } from 'react-native-calendars';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';
import BottomModal from './BottomModal';
import GradientButton from './GradientButton';

const SelectDatePicker = ({
  showTime=false,
  setShowTime=()=>{},
  timeDate,
  setTimeAndDate=()=>{},
  minimumDate,
  selectTime,
  title,
  yatchCalander
}) => {
  console.log(timeDate, 'timetimetime++++++');
  const {themeColor, themeToggle, themeColors} = useSelector(
    state => state?.initBoot,
  );
  const darkthemeusingDevice = getColorSchema();
  const [slotTime, setSlotTime] = useState([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ]);
  const [slotPeriods, setSlotPeriods] = useState(['AM', 'PM']);

  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const _onPressDone = () => {
    if (!timeDate?.date) {
      alert('please select Date');
      return;
    } else if (!timeDate?.period) {
      alert('please select period');
      return;
    } else if (!timeDate.time) {
      alert('please select Time');
      return;
    }
    let newObj = {...timeDate}
    newObj.dateAndTime= `${timeDate?.date} ${
      timeDate?.time <= 9 ? `0${timeDate?.time}:00` : `${timeDate?.time}:00`
        } ${timeDate.period}`
        setTimeAndDate(newObj)
      setShowTime(!showTime)
    
  };
  return (
    <View style={{}}>
     
      <BottomModal
        mainViewStyle={{height: height / 1.1, width: width, padding: 0,backgroundColor:isDarkMode?MyDarkTheme.colors.lightDark:colors.white}}
        onBackdropPress={() => {
         
          setShowTime(false)
          // setopencalender(!opencalender)
        }}
        isVisible={ showTime}
        renderModalContent={() => (
          <ScrollView>
            
          <View style={{flexDirection: 'column'}}>
            <View style={styles(isDarkMode).headermodal}>
              <TouchableOpacity
                onPress={async() => {

            setShowTime(false)
        
                }}
                style={{}}>
                <Image
                  source={imagePath.icCross1}
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.white
                      : colors.black,
                    ...styles.crossimg,
                  }}
                />
              </TouchableOpacity>
              <Text style={styles(isDarkMode).headertext}>
                {title == strings.PICKUP_DATE
                  ? strings.SELECT_PICKUP_DATE_TIME
                  : strings.SELECT_RETURN_DATE_TIME}
              </Text>
            </View>
            <CalendarList
              endFillColor={colors.white}
              horizontal={true}
              pagingEnabled={true}
              calendarWidth={width}
              calendarHeight={height / 2.6}
              // renderArrow={_renderArrow}
              hideArrows={false}
              onDayPress={value => {
                let newObj = {...timeDate}
                newObj.date = value?.dateString
               setTimeAndDate(newObj)
                // setSelectDate(value?.dateString)
              }}
              minDate={new Date()}
              markedDates={{
                [timeDate.date]: {
                  selected: true,
                  selectedColor: themeColors.primary_color,
                },
              }}
              theme={{
                // arrowColor: Text,

                calendarBackground: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.white,
                dayTextColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
                monthTextColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
                textDisabledColor: isDarkMode
                  ? colors.whiteOpacity22
                  : colors.black,
                arrowColor: colors.atlanticgreen,
                todayTextColor: colors.atlanticgreen,
              }}
            />

            <View style={styles(isDarkMode).selecttimeview}>
              <Text
                style={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.semiBold,
                  color:isDarkMode?colors.white:colors.black
                }}>
                {strings.SELECTTIME}
              </Text>
              <View style={{flexDirection: 'row'}}>
                {slotPeriods.map(item => {
                  console.log(item, 'item++++item');
                  return (
                    <TouchableOpacity
                      style={[
                        styles(getColorSchema).AMview,
                        {
                          backgroundColor:
                            item == timeDate.period
                              ? themeColors?.primary_color
                              : colors.bordergreyrental,
                          borderRadius: moderateScale(4),
                        },
                      ]}
                      onPress={() =>{
                        //  setSelectedDayPeriods(item)
                         let newObj = {...timeDate}
                         newObj.period = item
                        setTimeAndDate(newObj)
                        }

                      }>
                      <Text
                        style={{
                          fontSize: textScale(12),
                          color:
                            item == timeDate.period
                              ? colors.white
                              :isDarkMode? colors.white: colors.black,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View
              style={{
                marginHorizontal: moderateScale(20),
                marginTop: moderateScaleVertical(26),
              }}>
              <FlatList
                numColumns={5}
                data={slotTime}
              
                renderItem={({item, index}) => (
                
                 
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() =>{
                      //  setSelectedTime(item)
                       let newObj = {...timeDate}
                       newObj.time = item
                      setTimeAndDate(newObj)
                       }}>
                    <View
                      style={[
                        styles(isDarkMode).slotview,
                        {
                          backgroundColor:
                          timeDate.time == item
                              ? themeColors?.primary_color
                              : colors.bordergreyrental,
                        },
                      ]}>
                      <Text
                        style={{
                          fontSize: textScale(12),
                          color:
                          timeDate.time == item ? colors.white : isDarkMode?colors.white: colors.black,
                          opacity: 0.7,
                        }}>
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
          
            </View>
            <View style={styles(isDarkMode).buttonview}>
              <GradientButton
                btnText={strings.CLEAR_ALL}
                colorsArray={[colors.white, colors.white]}
                containerStyle={{width: width / 2.3}}
                btnStyle={{
                  borderRadius: 4,
                  height: moderateScaleVertical(40),
                  borderColor: colors.atlanticgreen,
                  borderWidth: 1,
                }}
                textStyle={{color: colors.atlanticgreen}}
                onPress={() => {
                  // setSelectDate('');
                  // setSelectedTime('');
                  // setSelectedDayPeriods('');
                  let newObj = {...timeDate}
                  newObj.time = ''
                  newObj.period = ''
                  newObj.date= ''
                  newObj.dateAndTime = ''
                 setTimeAndDate(newObj)
                }}
              />
              <GradientButton
                btnText={strings.DONE}
                containerStyle={{width: width / 2.3}}
                btnStyle={{borderRadius: 4, height: moderateScaleVertical(40)}}
                onPress={_onPressDone}
              />
            </View>
          </View>

          </ScrollView>
        )}
      />
    </View>
  );
};

export default SelectDatePicker;

export const styles = isDarkMode =>
  StyleSheet.create({
    headingStyle: {
      fontSize: moderateScale(12),
      fontFamily: fontFamily.bold,
      color: isDarkMode ? colors.white : colors.black,
      textTransform: 'uppercase',
    },
    dateTextStyle: {
      marginRight: moderateScale(6),
      fontSize: textScale(10),
      color: isDarkMode ? colors.white : colors.black,
      // marginTop: moderateScaleVertical(8),
      fontFamily: fontFamily.regular,
    },
    modalview: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: colors.grey1,
      borderBottomWidth: 1,
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScaleVertical(12),
    },
    headermodal: {
      flexDirection: 'row',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: colors.grey1,
      borderBottomWidth: 1,
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScaleVertical(12),
    },
    headertext: {
      fontSize: textScale(16),
      fontFamily: fontFamily.bold,
      marginLeft: moderateScale(20),
      color:isDarkMode?colors.white:colors.black
    },
    selecttimeview: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: moderateScaleVertical(20),
      marginTop: moderateScaleVertical(20),
    },
    AMview: {
      justifyContent: 'center',
      alignItems: 'center',
      height: moderateScaleVertical(28),
      width: moderateScale(44),
      backgroundColor: colors.atlanticgreen,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    PMview: {
      justifyContent: 'center',
      alignItems: 'center',
      height: moderateScaleVertical(28),
      width: moderateScale(44),
      backgroundColor: colors.bordergreyrental,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    slotview: {
      justifyContent: 'center',
      marginRight: moderateScale(16),
      marginBottom: moderateScaleVertical(12),
      alignItems: 'center',
      height: moderateScaleVertical(28),
      width: moderateScale(56),
      // backgroundColor: colors.bordergreyrental,
      borderRadius: moderateScale(6),
    },
    entermanual: {
      width: moderateScale(126),
      alignItems: 'center',
      justifyContent: 'center',
      height: moderateScaleVertical(28),
      marginTop: 0,
      borderRadius: 4,
      backgroundColor: colors.bordergreyrental,
      fontSize: textScale(12),
    },
    buttonview: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: moderateScale(20),
      marginTop: moderateScaleVertical(24),
    },
  });
