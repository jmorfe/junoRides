import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useSelector } from 'react-redux';
import NoDataFound from '../../Components/NoDataFound';
import OoryksHeader from '../../Components/OoryksHeader';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { height } from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { showError, showSuccess } from '../../utils/helperFunctions';
import { getColorSchema } from '../../utils/utils';
import CardViewNotification from './CardViewNotification';
import stylesFunc from './styles';

export default function Notifications({ navigation }) {
  const {
    appData,
    themeColors,
    appStyle,
    currencies,
    languages,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({ themeColors, fontFamily });
  const [notificationsList, setNotificationsList] = useState([])
  const [notificationApiData, setnotificationApiData] = useState([])
  const [pageNo, setpageNo] = useState(1)
  const [lastPage, setlastPage] = useState(1)
  const [isRefreshing, setisRefreshing] = useState(false)
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    getNotifications()
  }, [])

  const getNotifications = (pageNo = 1) => {
    let url = `?page=${pageNo}&limit=6`

    actions.getAllNotifications(url, {}, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }).then((res) => {

      console.log(res, "<===getAllNotifications")
      setisRefreshing(false)
      setisLoading(false)
      setlastPage(res?.data?.last_page)
      let data = pageNo == 1 ? res?.data?.data : [...notificationApiData, ...res?.data?.data]
      setnotificationApiData(data)

      // Group the data by date
      const groupedData = data.reduce((result, item) => {
        const date = new Date(item.created_at).toDateString();
        if (!result[date]) {
          result[date] = [];
        }
        result[date].push(item);
        return result;
      }, {});
      // Convert the grouped data into an array of objects
      const groupedArray = Object.keys(groupedData).map(date => ({
        date,
        data: groupedData[date]
      }));
      setNotificationsList(groupedArray)
    }).catch(errorMethod)
  }

  const errorMethod = (error) => {
    console.log(error, "<===error")
    setisRefreshing(false)
    setisLoading(false)
    showError(error?.message || error?.error);
  };


  const handleRefresh = () => {
    setisRefreshing(true)
    setpageNo(1)
    getNotifications()
  }

  const onEndReached = () => {
    if (pageNo < lastPage) {
      setpageNo(pageNo + 1);
      getNotifications(pageNo + 1);
    }
  }

  const onDeleteNotification = (item = null, isDeleteAll = false) => {
    setisLoading(true)
    setpageNo(1)
    let apiData = isDeleteAll ? {} : { id: item?.id }
    actions.onDeleteNotifications(apiData, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }).then((res) => {
      console.log(res, "<===onDeleteNotifications")
      showSuccess("Success")
      getNotifications()
    }).catch(errorMethod)
  }


  const renderOrders = ({ item, index }) => {
    return <CardViewNotification data={item} indx={index} onDeleteNotification={onDeleteNotification} />;
  };


  return (
    <WrapperContainer
      isLoading={isLoading}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white} >
      <OoryksHeader leftTitle={strings.NOTIFICATIONS} />
      <View style={styles.headerLine} />
      <FlatList
        data={notificationsList}
        renderItem={renderOrders}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        onEndReached={onEndReached}
        ListEmptyComponent={() =>
          <NoDataFound
            isLoading={isLoading}
            containerStyle={{ marginVertical: height / 4 }}
          />
        }
        contentContainerStyle={styles.containerStyle}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListFooterComponent={() => <View style={{ height: 20 }} />}
      />
    </WrapperContainer>
  );
}
