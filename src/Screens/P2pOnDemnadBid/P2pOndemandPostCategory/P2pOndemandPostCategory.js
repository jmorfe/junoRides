import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
//custom components
import BorderTextInput from '../../../Components/BorderTextInput';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import WrapperContainer from '../../../Components/WrapperContainer';
//constants
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
//styling
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
//3rd party
import { cloneDeep, isEmpty } from 'lodash';
import { MultiSelect } from 'react-native-element-dropdown';
import FastImage from 'react-native-fast-image';
import FlashMessage from 'react-native-flash-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useSelector } from 'react-redux';
import CategoriesCard from '../../../Components/CategoriesCard';
import FormLoader from '../../../Components/Loaders/FormLoader';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import { checkValueExistInAry } from '../../../utils/commonFunction';
import { showError } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';

const P2pOndemandPostCategory = ({ navigation }) => {
  const modalRef = useRef();
  const {
    appData,
    currencies,
    languages,
    appStyle,
    themeColor,
    themeColors,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  const { userData } = useSelector((state) => state?.auth);
  const { location } = useSelector((state) => state?.home);

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors });
  const [isAutofillModal, setIsAutofillModal] = useState(false);
  const [data, setData] = useState();
  const [isAttributesModal, setIsAttributesModal] = useState(false);
  const [attributeInfo, setAttributeInfo] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [p2pCategories, setp2pCategories] = useState([]);
  const [selectedP2Pcategory, setP2Pcategory] = useState({});
  const [isLoadingP2pCategories, setLoadingP2pCategories] = useState(true);
  const [isP2pCategoriesRefreshing, setP2pCategoriesRefreshing] =
    useState(false);
  const [isLoadingAttributes, setLoadingAttributes] = useState(false);
  const [currSelectedFilter, setcurrSelectedFilter] = useState({ id: 1, type: 'All' })
  const [showMenu, setshowMenu] = useState(false)
  const [initCategories, setinitCategories] = useState([])

  useEffect(() => {
    getP2Pcategories();
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const handleBackButtonClick = () => {
    navigation.navigate(navigationStrings.HOMESTACK);
    return true;
  };


  const getP2Pcategories = () => {
    actions
      .getAllCategories(
        {
          type: 'p2p',
          // open_vendor: 0,
          // close_vendor: 0,
          // best_vendor: 0,
          // address: location?.address || '',
          // latitude: location?.latitude || '',
          // longitude: location?.longitude || '',
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, '<===response getP2pCategories');
        setp2pCategories(res?.data?.navCategories || []);
        setinitCategories(res?.data?.navCategories || []);
        setLoadingP2pCategories(false);
        setP2pCategoriesRefreshing(false);
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, '<===error in method');
    setLoadingP2pCategories(false);
    setP2pCategoriesRefreshing(false);
    showError(error?.message || error?.error);
  };
  const getListOfAvailableAttributes = () => {
    actions
      .getAvailableAttributes(
        `?category_id=${selectedP2Pcategory?.id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, '<===res');
        setLoadingAttributes(false);
        setAttributeInfo(res?.data);
      })
      .catch((err) => {
        setLoadingAttributes(false);
        console.log(err, '<===error');
        // modalRef.current.showMessage({
        //   type: 'danger',
        //   icon: 'danger',
        //   message: err?.message,
        // });
      });
  };

  const onChangeDropDownOption = (value, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = value;
    setAttributeInfo(attributeInfoData);
  };

  const onPressRadioButton = (item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.attribute_id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [item?.id];
    setAttributeInfo(attributeInfoData);
  };

  const onChangeText = (text, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [text];
    setAttributeInfo(attributeInfoData);
  };

  const onPressCheckBoxes = (value, data) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == value?.attribute_id,
    );
    if (!isEmpty(data?.values)) {
      let existingItmIndx = data?.values.findIndex((itm) => itm == value.id);
      if (existingItmIndx == -1) {
        attributeInfoData[indexOfAttributeToUpdate].values = [
          ...data?.values,
          value?.id,
        ];
      } else {
        let index = attributeInfoData[indexOfAttributeToUpdate].values.indexOf(
          value?.id,
        );
        if (index >= 0) {
          attributeInfoData[indexOfAttributeToUpdate].values.splice(index, 1);
        }
      }
    } else {
      attributeInfoData[indexOfAttributeToUpdate].values = [value?.id];
    }
    setAttributeInfo(attributeInfoData);
  };

  const onFillManaully = () => {
    setIsAutofillModal(false);
    setTimeout(() => {
      setIsAttributesModal(true);
      setLoadingAttributes(true);
    }, 500);
    getListOfAvailableAttributes();
  };

  const handleRefresh = () => {
    setP2pCategoriesRefreshing(true);
    setcurrSelectedFilter({ id: 1, type: 'All' })
    getP2Pcategories();
  };

  const onPressP2pCategory = (item) => {
    if (!!userData?.auth_token) {
      navigation.navigate(navigationStrings.ATTRIBUTE_INFORMATION, {
        category_id: item?.id,
        type_id: item?.type_id
      });
    } else {
      actions.setRedirection('p2pPost');
      actions.setAppSessionData('on_login');
    }
  };

  const onSelectedFilter = (selectedFilter) => {
    setcurrSelectedFilter(selectedFilter)
    let allCategories = cloneDeep(initCategories)
    if (selectedFilter?.id == 1) {
      setp2pCategories(allCategories)
    }
    else {
      const filteredItems = allCategories.filter(item => item.type_id === selectedFilter?.id);
      setp2pCategories(filteredItems)
    }



  };

  const homeAllFilters = () => {
    let homeFilter = [
      { id: 1, type: "All" },
      { id: 10, type: "Rent" },
      { id: 13, type: "Sell" },
    ];

    return homeFilter;
  };


  const renderAttributeOptions = useCallback(
    ({ item, index }) => {
      return (
        <View>
          <Text
            style={{
              ...styles.attributeTitle,
              marginBottom: moderateScaleVertical(6),
            }}>
            {item?.title}
          </Text>
          {item?.type == 1 ? (
            <MultiSelect
              style={{
                height: moderateScaleVertical(40),
                backgroundColor: colors.blackOpacity05,
                borderRadius: moderateScale(5),
              }}
              labelField="title"
              valueField="id"
              value={!isEmpty(item?.values) ? item?.values : []}
              data={item?.option}
              onChange={(value) => onChangeDropDownOption(value, item)}
              placeholder={'Select value'}
              fontFamily={fontFamily.regular}
              placeholderStyle={{
                color: colors.black,
                paddingHorizontal: moderateScale(5),
                fontSize: textScale(12),
                fontFamily: fontFamily.regular,
              }}
            />
          ) : item?.type == 3 ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: moderateScaleVertical(5),
              }}>
              {item?.option?.map((itm) => renderRadioBtns(itm, item))}
            </View>
          ) : item?.type == 4 ? (
            <TextInput
              placeholder={strings.TYPE_HERE}
              onChangeText={(text) => onChangeText(text, item)}
              style={styles.textInputStyle}
            />
          ) : (
            <View
              style={{
                flexDirection: 'row',

                flexWrap: 'wrap',
                marginTop: moderateScaleVertical(5),
              }}>
              {item?.option?.map((itm) => renderCheckBoxes(itm, item))}
            </View>
          )}
        </View>
      );
    },
    [attributeInfo],
  );

  const renderRadioBtns = useCallback(
    (item, data) => {
      return (
        <TouchableOpacity
          onPress={() => onPressRadioButton(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: moderateScale(20),
          }}>
          <Image
            source={
              !isEmpty(data?.values) && data?.values[0] == item?.id
                ? imagePath.icActiveRadio
                : imagePath.icInActiveRadio
            }
          />
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(14),
              marginLeft: moderateScale(6),
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [attributeInfo],
  );

  const renderCheckBoxes = useCallback(
    (item, data) => {
      return (
        <TouchableOpacity
          onPress={() => onPressCheckBoxes(item, data)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: moderateScale(20),
            marginBottom: moderateScaleVertical(10),
          }}>
          <Image
            source={
              checkValueExistInAry(item, data?.values)
                ? imagePath.checkBox2Active
                : imagePath.checkBox2InActive
            }
          />
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(12),
              marginLeft: moderateScale(6),
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [attributeInfo],
  );

  const renderP2Pcategories = ({ item, index }) => {
    return (
      <CategoriesCard item={item} onPress={() => onPressP2pCategory(item)} />
    )
  }

  const listFooterComponent = () => {
    return (
      <ButtonWithLoader
        btnText="Submit"
        btnStyle={{
          marginBottom: moderateScaleVertical(20),
          backgroundColor: themeColors.primary_color,
          borderWidth: 0,
        }}
        btnTextStyle={{
          textTransform: 'none',
        }}
      />
    );
  };

  const autoFillModalContent = () => {
    return (
      <View style={styles.modalViewStyle}>
        <Text style={styles.txtStyle}>Auto-fill your car details</Text>
        <Text style={styles.labelText}>Enter VIN / Chassis number</Text>
        <BorderTextInput
          onChangeText={(data) => setData(data)}
          containerStyle={{
            backgroundColor: colors.blackOpacity05,
            borderWidth: 0,
          }}
          textInputStyle={{
            paddingHorizontal: 16,
            fontSize: 18,
            fontFamily: fontFamily.regular,
          }}
          placeholder={''}
          value={data}
          autoCapitalize={'none'}
          autoFocus={true}
          returnKeyType={'next'}
        />

        <GradientButton
          containerStyle={{ marginTop: moderateScale(18), width: '100%' }}
          colorsArray={['#FF8D8A', '#FC7049', '#FD312C']}
          // onPress={_onLogin}
          btnText={strings.AUTO_FILL_DETAILS}
        />
        <TouchableOpacity
          style={styles.linkButton}
          activeOpacity={0.7}
          // onPress={onFillManaully}
          onPress={() => {
            setIsAutofillModal(false);
            navigation.navigate(navigationStrings.ATTRIBUTE_INFORMATION, {
              category_id: selectedP2Pcategory?.id,

            });
          }}>
          <Text style={styles.linkStyle}>{strings.FILL_MANUALLY}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const attributesModalContent = () => {
    return (
      <WrapperContainer

      >
        <Header
          centerTitle={'Attribute Information'}
          leftIcon={imagePath.back1}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: moderateScale(20),
          }}>
          {isLoadingAttributes ? (
            <View
              style={{
                flex: 1,
              }}>
              <FormLoader />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  ...styles.attributeTitle,
                  marginTop: moderateScaleVertical(20),
                }}>
                Name
              </Text>
              <TextInput
                placeholder={strings.TYPE_HERE}
                onChangeText={(text) => setName(text)}
                style={styles.textInputStyle}
              />

              <Text
                style={{
                  ...styles.attributeTitle,
                  marginTop: moderateScaleVertical(20),
                }}>
                Description
              </Text>
              <TextInput
                placeholder={strings.TYPE_HERE}
                onChangeText={(text) => setDescription(text)}
                style={styles.textInputStyle}
              />

              <View
                style={{
                  flex: 1,
                  marginTop: moderateScaleVertical(16),
                }}>
                <FlatList
                  data={attributeInfo}
                  scrollEnabled={false}
                  keyboardShouldPersistTaps={'handled'}
                  keyExtractor={(itm) => String(itm?.id)}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: moderateScaleVertical(18),
                      }}
                    />
                  )}
                  renderItem={renderAttributeOptions}
                  ListFooterComponent={listFooterComponent}

                />
              </View>
              <FlashMessage ref={modalRef} position={'top'} />
            </View>
          )}
        </KeyboardAwareScrollView>
      </WrapperContainer>
    );
  };


  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.white
      }>
      <View style={{ marginBottom: moderateScale(18) }}>
        <View style={{ marginHorizontal: moderateScale(15) }}>
          <View style={{
            flexDirection: "row",

            justifyContent: "space-between",
            marginBottom: moderateScale(20),
            marginTop: moderateScale(32),

          }}>


            <Text
              style={{
                ...styles.header,
                color: !!themeColor ? colors.white : colors.black,
              }}>
              {strings.SELECT_YOUR_CATEGORY}
            </Text>
            <Menu style={{ alignSelf: 'flex-end' }}>
              <MenuTrigger>
                <View style={styles.menuView}>
                  <FastImage
                    style={{
                      height: moderateScaleVertical(16),
                      width: moderateScale(16),
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.white
                        : colors.black,
                    }}
                    resizeMode="contain"
                    source={isDarkMode ? imagePath.sortSelected : imagePath.sort}
                  />
                  <Text
                    style={{
                      fontSize: textScale(12),
                      marginHorizontal: moderateScale(5),
                      fontFamily: fontFamily.regular,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {!currSelectedFilter
                      ? strings.RELEVANCE
                      : currSelectedFilter?.type}
                  </Text>
                </View>
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    marginTop: moderateScaleVertical(36),
                    width: moderateScale(100),
                  },
                }}>
                {homeAllFilters()?.map((item, index) => {
                  return (
                    <View key={index}>
                      <MenuOption
                        onSelect={() => onSelectedFilter(item)}
                        key={String(index)}
                        text={item?.type}
                        style={{
                          marginVertical: moderateScaleVertical(5),
                        }}
                      />
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: colors.greyColor,
                        }}
                      />
                    </View>
                  );
                })}
              </MenuOptions>
            </Menu>
          </View>
          {isLoadingP2pCategories ? (
            <View>
              {['', '', '', ''].map(() => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: moderateScale(10),
                  }}>
                  <HeaderLoader
                    widthLeft={width / 2.5}
                    rectWidthLeft={width / 2.5}
                    heightLeft={height / 6.5}
                    rectHeightLeft={height / 6.5}
                    isRight={false}
                    rx={15}
                    ry={15}
                    viewStyles={{
                      marginHorizontal: moderateScale(5),
                    }}
                  />
                  <HeaderLoader
                    widthLeft={width / 2.5}
                    rectWidthLeft={width / 2.5}
                    heightLeft={height / 6.5}
                    rectHeightLeft={height / 6.5}
                    isRight={false}
                    rx={15}
                    ry={15}
                    viewStyles={{
                      marginHorizontal: moderateScale(5),
                    }}
                  />
                </View>
              ))}
            </View>
          ) : (
            <FlatList
              data={p2pCategories}
              renderItem={renderP2Pcategories}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                justifyContent: "space-between"
              }}
              ItemSeparatorComponent={() => {
                return (
                  <View style={{ height: moderateScale(16) }} />
                )
              }}
              ListFooterComponent={() => <View style={{
                height: moderateScaleVertical(200)
              }} />}
              refreshControl={
                <RefreshControl
                  refreshing={isP2pCategoriesRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={themeColors.primary_color}
                />
              }
            />
          )}
        </View>
      </View>
      <Modal
        style={styles.modalStyle}
        isVisible={isAutofillModal}
        onBackdropPress={() => setIsAutofillModal(false)}>
        {autoFillModalContent()}
      </Modal>
      <Modal
        style={{
          margin: 0,
        }}
        isVisible={isAttributesModal}
        onBackdropPress={() => setIsAttributesModal(false)}>
        {attributesModalContent()}
      </Modal>
    </WrapperContainer>
  );
};

export default P2pOndemandPostCategory;

function stylesFunc({ fontFamily, themeColor }) {
  // alert(!!themeColor);
  const styles = StyleSheet.create({
    header: {


      fontSize: 19,
      fontFamily: fontFamily.medium,
    },
    categoryStyle: {
      flex: 1,
      borderRadius: moderateScale(12),
      marginHorizontal: moderateScale(10),
      height: height / 6,
      width: width / 2.5,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: moderateScale(10),
    },
    textStyle: {
      fontFamily: fontFamily.medium,
      marginTop: moderateScale(5),
      textAlign: 'center',
    },
    modalStyle: {
      overflow: 'hidden',
      justifyContent: 'flex-end',
      marginHorizontal: 0,
      marginBottom: 0,
    },
    modalViewStyle: {
      flex: 0.5,
      backgroundColor: 'white',
      padding: moderateScale(16),
      // alignItems: 'center',
      borderTopRightRadius: moderateScale(24),
      borderTopLeftRadius: moderateScale(24),
    },
    txtStyle: {
      fontFamily: fontFamily.medium,
      fontSize: 16,
      letterSpacing: 0.3,
      textAlign: 'center',
      marginVertical: moderateScale(18),
    },
    linkStyle: {
      color: colors.orange1,
      fontFamily: fontFamily.regular,
      fontSize: 16,
      marginTop: moderateScale(12),
      textAlign: 'center',
    },
    labelText: {
      textAlign: 'left',
      marginVertical: moderateScale(12),
      fontFamily: fontFamily.regular,
    },
    linkButton: { flex: 1, justifyContent: 'flex-end', marginBottom: '5%' },
    labelStyle: {
      fontFamily: fontFamily.bold,
      color: colors.blackOpacity43,
      fontSize: textScale(12),
      marginBottom: moderateScale(10),
    },
    attributeTitle: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    textInputStyle: {
      backgroundColor: colors.blackOpacity05,
      height: moderateScaleVertical(40),
      marginTop: moderateScaleVertical(5),
      borderRadius: moderateScale(5),
      paddingHorizontal: moderateScale(5),
    },
    menuView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(4),
      borderWidth: 0.3,
      borderColor: colors.textGreyB,
      width: moderateScale(100),
      height: moderateScale(30)
    },
  });
  return styles;
}
