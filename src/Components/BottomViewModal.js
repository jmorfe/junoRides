import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';

import {
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';

const BottomViewModal = ({
  show,
  mainContainView,
  closeModal = () => {},
  isDatetimePicker = false,
}) => {
  return (
    <Modal
      isVisible={show}
      style={
        isDatetimePicker
          ? [styles.modal, {justifyContent: 'flex-end'}]
          : styles.modal
      }
      onBackdropPress={closeModal}
      animationInTiming={600}>
      <View
        style={[
          styles.modalContainer,
          {width: isDatetimePicker ? width : width - 50},
        ]}>
        <TouchableOpacity
          // hitSlop={{top: 200, left: 200, right: 200, bottom: 200}}
          style={{ alignSelf: 'flex-end', }}
          onPress={closeModal}>
          <Image
          style={{tintColor:"black"}}
            source={imagePath.ic_cross}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {isDatetimePicker ? null : (
          <View
            style={{
              height: moderateScaleVertical(30),
              width: width - 60,

              alignItems: 'center',
            }}>
            <Text style={{fontSize: textScale(14)}}>{'Rate Your Ride'}</Text>
          </View>
        )}
        {mainContainView()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    width: width - 50,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 18,
    color: '#555',
    marginTop: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});
export default React.memo(BottomViewModal);
