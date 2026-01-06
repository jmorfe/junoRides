import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useSelector } from 'react-redux';
import imagePath from '../../constants/imagePath';
import colors from '../../styles/colors';
import {
  moderateScaleVertical
} from '../../styles/responsiveSize';
import { getDaysFormat } from '../../utils/commonFunction';
import stylesFunc from './styles';


export default function CardViewNotification({ data = {}, conatinerStyle = {}, indx = 0, onDeleteNotification = () => { } }) {
  const { appStyle } = useSelector(state => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });



  const renderItem = ({ item, index }) => {
    return <View style={{ flexDirection: 'row', backgroundColor: colors.white }}>
      <View style={styles.cardView}>
        <Image source={imagePath.ic_activeBell} />
      </View>
      <View
        style={{
          flex: 0.85,
          justifyContent: 'center',
        }}>
        <Text numberOfLines={1} style={styles.message}>
          {item?.title}
        </Text>
        <Text style={styles.descText}>{item?.message}</Text>
      </View>
    </View>
  }

  return (
    <View style={[styles.container, conatinerStyle]}>
      <Text style={{ ...styles.time, marginBottom: moderateScaleVertical(10) }}>
        {getDaysFormat(data?.date)}
      </Text>
      <SwipeListView
        data={data?.data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        keyExtractor={(item, index) => String(index)}
        renderHiddenItem={(item, rowMap) => {

          return <View style={styles.rowBack}>
            <TouchableOpacity
              onPress={() => {
                onDeleteNotification(data?.data[item.index])
              }}
              style={[styles.backRightBtn, styles.backRightBtnRight]}
            >
              <Image source={imagePath.delete} />
            </TouchableOpacity>
          </View>
        }}
        disableRightSwipe
        rightOpenValue={-150}
        previewRowKey={indx === 0 ? '0' : ''}
        previewOpenDelay={3000}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}

      />
    </View>
  );
}
