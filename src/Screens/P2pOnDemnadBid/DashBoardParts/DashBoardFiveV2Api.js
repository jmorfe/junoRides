import { useScrollToTop } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';

import BannerHome2 from '../../../Components/BannerHome2';
import HomeCategoryCardP2p from '../../../Components/HomeCategoryCardP2p';
import MarketCard3 from '../../../Components/MarketCard3';
import ProductsComp2 from '../../../Components/ProductsComp2';
import ProductsCompP2p from '../../../Components/ProductsCompP2p';
import SingleCategoryProducts from '../../../Components/SingleCategoryProducts';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl
} from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';
import stylesFunc from '../styles';
import DashBoardFiveV2ApiLoader from './DashBoardFiveV2ApiLoader';

const DashBoardFiveV2Api = ({
  handleRefresh = () => { },
  bannerPress = () => { },
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  navigation = {},
  onVendorFilterSeletion = () => { },
  tempCartData = null,
  onPressVendor = () => { },
  onClose = () => { },
  onPressSubscribe = () => { },
  isSubscription = false,
  showAllProducts = () => { },
  showAllSpotDealAndSelectedProducts = () => { }
}) => {
  const scrollRef = React.useRef(null);
  useScrollToTop(scrollRef);
  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  let businessType = appData?.profile?.preferences?.business_type || null;


  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState(0)
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });



  const _renderCategories = useCallback(({ item, index }) => {
    return (
      <HomeCategoryCardP2p
        imgRadius={2}
        data={item}
        onPress={() => onPressCategory(item)}
        isLoading={isLoading}
        applyRadius={true}
        index={index}
      />



    );
  }, [])

  const _renderVendors = useCallback(({ item, index }) => (
    <View style={{ width: width - width / 3.5 }}>
      <MarketCard3
        data={item}
        onPress={() => onPressVendor(item)}
        extraStyles={{ margin: 2 }}
      />
    </View>
  ), [])

  const _renderBrands = useCallback(({ item }) => {
    const imageURI = item?.image?.proxy_url
      ? getImageUrl(item.image.proxy_url, item.image.image_path, '800/600')
      : item?.image_url;
    const isSVG = imageURI ? imageURI.includes('.svg') : null;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}>
        {isSVG ? (
          <SvgUri
            height={moderateScale(96)}
            width={moderateScale(96)}
            uri={imageURI}
          />
        ) : (
          <FastImage
            source={{ uri: imageURI, priority: FastImage.priority.high }}
            style={{
              height: moderateScale(96),
              width: moderateScale(96),
              borderRadius: moderateScale(10),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
              borderWidth: 1,
              borderColor: colors.borderStroke
            }}
          />
        )}
      </TouchableOpacity>
    );
  }, [])

  const onViewAll = useCallback((type, data) => {
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  }, [])

  const vendorHeader = useCallback((item) => {
    if (appData?.profile?.preferences?.single_vendor) {
      return (
        <View
          style={{
            marginBottom: moderateScaleVertical(24),
            marginTop: moderateScaleVertical(8),
          }}
        />
      );
    }
    return (
      <View key={Math.random()}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: moderateScaleVertical(8)
        }}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.exploreStoresTxt,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,

              flex: 1,
            }}>
            {`${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`}
          </Text>

          {item?.data?.length > 1 && (
            <TouchableOpacity
              style={{ marginHorizontal: moderateScale(4) }}
              onPress={() => onViewAll('vendor', appMainData?.vendors)}>
              <Text
                style={{
                  ...styles.viewAllText,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : themeColors.primary_color,
                }}>
                {strings.VIEW_ALL}
              </Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    );
  }, [appData, isDarkMode, appMainData])

  const onPressViewEditAndReplace = useCallback((item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.vendors[0].order_id,
      orderDetail: {
        dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
      },
      selectedVendor: { id: item?.vendors[0].vendor_id },
    });
  }, [])



  const moveToNewScreen = (screenName, data = {}) => () => { navigation.navigate(screenName, { data }) }


  const renderHomePageItems = useCallback(({ item, index }) => {
    return (
      <View key={String(item?.id)} >
        {
          item?.slug == 'banner' ? (
            <BannersView item={item} showTitle={false} />
          ) :
            (item?.slug == 'new_products' ||
              item?.slug == 'featured_products' ||
              item?.slug == 'on_sale' ||
              item?.slug == 'most_popular_products') ? <ProductsThemeView item={item} /> : item?.slug == 'vendors' ?
              <VendorsView item={item} />
              : item?.slug == 'nav_categories' ? (
                <CategoriesView item={item} showTitle={false} />
              ) : item?.slug == 'best_sellers' ? (
                <BestSellersView item={item} />
              ) : item?.slug == 'brands' ? (
                <BrandsView item={item} />
              ) : item?.slug == 'spotlight_deals' ? (
                <SpotlightDealsView item={item} />
              ) : item?.slug == 'selected_products' ? (
                <SelectedProductsThemeView item={item} />
              ) : item?.slug == 'single_category_products' ? <SingleCategoryProductsView item={item} /> :
                <React.Fragment />
        }
      </View>
    );
  }, [isDarkMode, MyDarkTheme])

  const showAllTempCartOrders = useCallback(() => {
    return (
      <View>
        {!isEmpty(tempCartData) && tempCartData?.length
          ? tempCartData?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => onPressViewEditAndReplace(item)}
                style={{
                  padding: moderateScale(8),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // alignItems: 'center',
                  backgroundColor: getColorCodeWithOpactiyNumber(
                    themeColors?.primary_color.substr(1),
                    20,
                  ),
                  marginHorizontal: moderateScale(15),
                  marginTop: moderateScale(15),
                  borderRadius: moderateScale(5),
                  borderWidth: moderateScale(0.5),
                  borderColor: themeColors?.primary_color,
                }}>
                <View style={{ flex: 0.7 }}>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.medium,
                    }}>
                    {strings.YOURDRIVERHASMODIFIED}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      paddingTop: moderateScale(5),
                      fontFamily: fontFamily.bold,
                    }}>
                    {strings.VIEW_DETAIL}
                  </Text>
                </View>
                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.medium,
                    }}>{`#${item?.order_number}`}</Text>
                </View>
              </TouchableOpacity>
            );
          })
          : null}
      </View>
    );
  }, [fontFamily, themeColors, tempCartData])

  const _renderProducts = useCallback(({ item, index }) => {
    return (
      <ProductsCompP2p
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, {
            product_id: item?.id,
          })
        }
      />

    );
  }, [])

  const _renderSingleCategoryProducts = useCallback(({ item, index }) => {
    return (

      <SingleCategoryProducts
        mainContainerStyle={{
          borderRadius: moderateScale(20),
          overflow: 'hidden',
          height: moderateScaleVertical(130),
          elevation: 0,
          alignItems: 'center',
          width: width / 3 - 10

        }}
        showRating={false}
        imageStyle={{ width: moderateScale(width / 4), height: moderateScaleVertical(80), resizeMode: 'cover' }}
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
        productNameStyle={{ textAlign: 'center', fontSize: textScale(10), marginBottom: moderateScaleVertical(5) }}
        numberOfLines={2}
      />


    );
  }, [])

  const ProductsThemeView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginTop: moderateScaleVertical(16),
      }}>
        {item?.slug == 'most_popular_products' ? <TitleViewHome item={{ title: strings.FEATURED_PRODUCTS }} /> : <TitleViewHome item={item} />}

        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderProducts}
          keyExtractor={(item) => item?.id?.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
          // ListHeaderComponent={() => (
          //   <View style={{ marginLeft: moderateScale(16) }} />
          // )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}

        />
      </View>
    ) : (
      <React.Fragment />
    );
  }, [isDarkMode, MyDarkTheme])

  const SingleCategoryProductsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginTop: moderateScaleVertical(16)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={{ title: item?.data?.category_detail?.slug }} />
          {item?.data?.category_detail?.products?.length >= 9 && <TouchableOpacity onPress={() => showAllProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>
        <View style={{ marginHorizontal: moderateScale(8) }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            numColumns={2}
            data={item?.data?.category_detail?.products}
            renderItem={_renderSingleCategoryProducts}
            keyExtractor={(item) => item?.id?.toString()}
            ListFooterComponent={() => (
              <View style={{ marginRight: moderateScale(16) }} />
            )}
          />
        </View>
      </View>
    ) : (
      <React.Fragment />
    );
  }, [themeColors, fontFamily])

  const _renderSelectedProducts = useCallback(({ item, index }) => {
    console.log(item, " selected");
    return (
      <ProductsCompP2p
        mainContainerStyle={{
          width: moderateScale(width / 4),
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScaleVertical(8),
          borderRadius: moderateScale(20),
          overflow: 'hidden',
          height: moderateScaleVertical(130),
          elevation: 0,

        }}
        showRating={false}
        imageStyle={{ width: moderateScale(width / 4), height: moderateScaleVertical(80), resizeMode: 'cover' }}
        item={item?.products}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
        productNameStyle={{ textAlign: 'center', fontSize: textScale(10), marginBottom: moderateScaleVertical(5) }}
        numberOfLines={2}
      />)

  }, [])

  const SelectedProductsThemeView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginTop: moderateScaleVertical(16)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={item} />
          {item?.data?.length >= 9 && <TouchableOpacity onPress={() => showAllSpotDealAndSelectedProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          // horizontal
          style={{ width: width, alignItems: 'center' }}
          numColumns={3}
          data={item?.data}
          renderItem={_renderSelectedProducts}
          keyExtractor={(item) => item?.id?.toString()}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  }, [themeColors, fontFamily])

  const CategoriesView = useCallback(({ item, showTitle }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginTop: moderateScaleVertical(16)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: moderateScaleVertical(6), alignItems: "center" }}>
          <Text style={{ fontSize: textScale(16), fontFamily: fontFamily?.medium, color: isDarkMode ? MyDarkTheme.colors.text : colors.black, }}>{strings.CATEGORIES}</Text>
          <TouchableOpacity
            onPress={() => { navigation.navigate(navigationStrings.ALL_CATEGORIES) }}>
            <Text style={{ color: themeColors?.primary_color, fontFamily: fontFamily?.regular, fontSize: textScale(11) }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{

            borderRadius: moderateScale(8),
            backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.white,
            borderWidth: moderateScale(1),
            borderColor: colors.borderColor,
            paddingVertical: moderateScale(16),
          }}
        >
          <FlatList
            key={'6'}
            data={item?.data}
            keyExtractor={(item) => item?.id?.toString()}
            showsHorizontalScrollIndicator={false}
            numColumns={4}
            renderItem={_renderCategories}
            ItemSeparatorComponent={() => (
              <View style={{ height: moderateScale(8), }} />
            )}

          />
        </View>


      </View>
    ) : (
      <React.Fragment />
    );
  }, [isDarkMode, MyDarkTheme])

  const VendorsView = useCallback(({ item }) => {
    return item?.data?.length > 1 ? (
      <View style={{
        marginTop: moderateScaleVertical(16)
      }}>
        {vendorHeader(item)}
        <FlatList
          horizontal
          // alwaysBounceVertical={true}
          data={item?.data}
          keyExtractor={(item) => item?.id?.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={_renderVendors}
          ListFooterComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListEmptyComponent={() => (
            <View>
              <FastImage
                source={imagePath.noDataFound}
                resizeMode="contain"
                style={{
                  width: moderateScale(140),
                  height: moderateScale(140),
                  alignSelf: 'center',
                  marginTop: moderateScaleVertical(30),
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: textScale(11),
                  fontFamily: fontFamily.regular,
                  marginHorizontal: moderateScale(10),
                  lineHeight: moderateScale(20),
                  marginTop: moderateScale(5),
                }}>
                {businessType == 'home_service'
                  ? `${strings.WR_ARE_CURRENTLY_NOT_OPERATING} `
                  : `${strings.SORRY_MSG}`}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ width: moderateScale(10) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  }, [])

  const _renderBestVendors = useCallback(({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressVendor(item)}
        activeOpacity={0.7}
        style={{
          height: moderateScaleVertical(140),
          width: width - width / 3.5,
          borderRadius: moderateScale(10),
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FastImage
          source={{ uri: item?.logo?.image_s3_url }}
          style={{
            ...StyleSheet.absoluteFill,
            height: moderateScaleVertical(140),
            width: width - width / 3.5,
          }}
        />
        <View
          style={{
            ...StyleSheet.absoluteFill,
            height: moderateScaleVertical(140),
            width: width - width / 3.5,
            backgroundColor: colors.blackOpacity66,
          }}
        />
        {!!item?.rating !== '0.0' && (
          <View
            style={{ ...styles.hdrRatingTxtView, position: 'absolute', top: 0 }}>
            <Text
              style={{
                ...styles.ratingTxt,
                fontFamily: fontFamily.medium,
              }}>
              {Number(item?.rating).toFixed(1)}
            </Text>
            <Image
              style={styles.starImg}
              source={imagePath.star}
              resizeMode="contain"
            />
          </View>
        )}
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(18),
            color: colors.white,
          }}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  }, [])

  const BestSellersView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginTop: moderateScaleVertical(16)
      }}>
        <TitleViewHome item={item} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderBestVendors}
          keyExtractor={(item) => item?.id?.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
          // ListHeaderComponent={() => (
          //   <View style={{ marginLeft: moderateScale(16) }} />
          // )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  }, [])

  const BrandsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginTop: moderateScaleVertical(16)
      }}>
        <TitleViewHome item={item} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderBrands}
          keyExtractor={(item) => item?.id?.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginRight: moderateScale(12) }} />
          )}
          // ListHeaderComponent={() => (
          //   <View style={{ marginLeft: moderateScale(16) }} />
          // )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  }, [])

  const TitleViewHome = useCallback(({ item, titleViewStyle = {} }) => {
    return (
      <Text
        style={{
          ...styles.exploreStoresTxt,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          marginBottom: moderateScaleVertical(6),

        }}>
        {!isEmpty(item?.translations) ? (item?.translations[0]?.title || item?.title) : item?.title}
      </Text>
    );
  }, [isDarkMode, MyDarkTheme])


  const _renderSpotlightDeals = useCallback(({ item }) => {
    return (
      <ProductsComp2
        item={item}
        onPress={() => navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })}
        numberOfLines={2}
      />
    )
  }, [])

  const SpotlightDealsView = useCallback(({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginTop: moderateScaleVertical(16)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={item} />
          {item?.data?.length >= 9 &&
            <TouchableOpacity onPress={() => showAllSpotDealAndSelectedProducts(item)}>

              <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
            </TouchableOpacity>}
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderSpotlightDeals}
          keyExtractor={(item) => item?.id?.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginRight: moderateScale(12) }} />
          )}
          // ListHeaderComponent={() => (
          //   <View style={{ marginLeft: moderateScale(16) }} />
          // )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  }, [themeColors, fontFamily])



  const BannersView = useCallback(({ item = {}, showTitle = true }) => {

    return !isEmpty(appMainData?.mobile_banners || appData?.mobile_banners || item?.banner_image) ?
      <View style={{
        marginTop: moderateScaleVertical(16),

      }}>
        {!!showTitle && <TitleViewHome item={item} />}
        <BannerHome2
          slider1ActiveSlide={slider1ActiveSlide}
          bannerData={
            appMainData?.mobile_banners ||
            appData?.mobile_banners ||
            item?.banner_image
          }
          isPagination={true}
          sliderWidth={width - moderateScale(32)}
          itemWidth={width - moderateScale(32)}
          onSnapToItem={(index) => setSlider1ActiveSlide(index)}
          // onPress={(item) => bannerPress(item)}
          isDarkMode={isDarkMode}
        />
      </View> : <React.Fragment />
  }, [appMainData, appData, isDarkMode, MyDarkTheme])


  const keyExtractorUnique = useCallback((item, index) => !!item?.id ? String(item.id) : String(index))

  if (isLoading) { return (<DashBoardFiveV2ApiLoader />) } //home loader

  return (
    <WrapperContainer >
      {showAllTempCartOrders()}
      <View style={{
        paddingHorizontal: moderateScale(16),
        backgroundColor: isDarkMode ? colors.black : colors.white,
        flex: 1
      }}>
        <FlatList
          data={!!appMainData?.homePageLabels ? appMainData?.homePageLabels || [] : []}
          renderItem={renderHomePageItems}

          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractorUnique}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          ListFooterComponent={() => <View
            style={{
              height:
                Platform.OS == 'ios' ? moderateScale(10) : moderateScale(20),
            }}
          />}
        />
      </View>
    </WrapperContainer>
  );
}


export default React.memo(DashBoardFiveV2Api);