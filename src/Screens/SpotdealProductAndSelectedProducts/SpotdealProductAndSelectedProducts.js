import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import { useSelector } from 'react-redux';
import FooterLoader from '../../Components/FooterLoader';
import Header from '../../Components/Header';
import NoDataFound from '../../Components/NoDataFound';
import ProductsComp2 from '../../Components/ProductsComp2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { moderateScale, moderateScaleVertical, width } from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { showError } from '../../utils/helperFunctions';
import { getColorSchema } from '../../utils/utils';

export default function SpotdealProductAndSelectedProducts(props) {
    const { route, navigation } = props

    const { data } = route?.params

    const parmasData = data
    const {
        appData,
        currencies,
        languages,
        appStyle,
        isDineInSelected,
        themeColor,
        themeToggle,
        themeColors,
        allAddresss,
    } = useSelector((state) => state?.initBoot);
    const { location, appMainData, dineInType, isLocationSearched } = useSelector(
        (state) => state?.home,
    );
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    const { profile } = appData;

    const [productListData, setProductListData] = useState([]);
    const [loadMore, setLoadMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false)


    useEffect(() => {
        onLoadAllProducts()
    }, [isRefreshing, pageNo])




    const onLoadAllProducts = () => {
        const apiData = {
            layout_id: parmasData?.slug == 'selected_products' && parmasData?.id,
            page: pageNo
        }
        const apiHeader = {
            code: appData.profile.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
            systemuser: deviceInfoModule.getUniqueId(),
        }

        setIsLoading(true)
        actions.onGetProductsOnHomePage(apiData, apiHeader).then((res) => {
            console.log(res,'resss')
            setProductListData(pageNo == 1
                ? res.data.data
                : [...productListData, ...res?.data?.data])
            setIsLoading(false)
            setIsRefreshing(false)
        }).catch((error) => {
            console.log(error,'errorerror')
            showError(error?.message || error?.error);
            setIsLoading(false)
            setIsRefreshing(false)
        })
    }



    //pagination of data
    const onEndReached = ({ distanceFromEnd }) => {
        setPageNo(pageNo + 1)
    };

    const onEndReachedDelayed = debounce(onEndReached, 1000, {
        leading: true,
        trailing: false,
    });

    const handleRefresh = () => {
        setIsRefreshing(true)
    };


    const renderProduct = useCallback(({ item, index }) => {
        console.log(item,'itemmmmmmmmmmmm')
        return (
            <ProductsComp2
                mainContainerStyle={{
                    marginHorizontal: moderateScale(10),
                    marginVertical: moderateScaleVertical(8),
                    width: moderateScale(width / 3.8),
                    overflow: 'hidden',
                    height: moderateScaleVertical(163)
                }}
                item={parmasData?.slug == 'selected_products'? item?.products:item}
                onPress={() =>
                    navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
                }
                imageStyle={{ width: moderateScale(width / 3.8), height: moderateScaleVertical(90), resizeMode: 'cover' }}

            />


        )

    }, [productListData])

    const awesomeChildListKeyExtractor = useCallback(
        (item) => `awesome-child-key-${item?.id}`,
        [productListData],
    );

    const listFooterComponent = () => {
        return <View style={{ height: moderateScale(100) }}>
            {
                !!loadMore && <FooterLoader style={{ color: themeColors?.primary_color }} />
            }

        </View>;
    };

    const listEmptyComponent = useCallback(() => {
        return (
            <NoDataFound
                isLoading={isLoading}
                containerStyle={{}}
                text={strings.NOPRODUCTFOUND}
            />
        );
    }, [productListData]);


    return (
        <WrapperContainer
            statusBarColor={colors.backgroundGrey}
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.statusbarColor
            }
            isLoading={isLoading}
        >

            <Header
                leftIcon={
                    imagePath.backArrowCourier
                }
                centerTitle={parmasData?.title || parmasData?.slug}
                headerStyle={
                    isDarkMode
                        ? { backgroundColor: MyDarkTheme.colors.background }
                        : { backgroundColor: colors.white }
                }
            />
            <View style={{ width: width, alignItems: 'center' }}>


                <FlatList
                    numColumns={3}
                    disableScrollViewPanResponder
                    showsVerticalScrollIndicator={false}
                    data={productListData}
                    renderItem={renderProduct}
                    keyExtractor={awesomeChildListKeyExtractor}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ flexGrow: 1 }}
                    extraData={productListData}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    refreshing={isRefreshing}
                    initialNumToRender={12}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor={themeColors.primary_color}
                        />
                    }
                    onEndReached={
                        onEndReachedDelayed
                    }
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={listFooterComponent}
                    ListEmptyComponent={listEmptyComponent}
                />

            </View>

        </WrapperContainer>
    )
}