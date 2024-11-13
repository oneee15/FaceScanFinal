import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../app.json';
import MakeIcon from './Icons';

const renderButtonContent = ({iconProp, textProp, text, textStyle}) => {
  return (
    <View style={{...gradientStyles.wrapper}}>
      <View style={{...gradientStyles.iconWrapper, ...iconProp?.style}}>
        {iconProp && !iconProp.float && <MakeIcon 
            type={iconProp.type} 
            name={iconProp.name} 
            size={iconProp.size} 
            color={iconProp.color} 
          />}
      </View>
      <View style={gradientStyles.textWrapper}>
        <Text style={{...gradientStyles.textStyle}}>{text}</Text>
      </View>
      <View style={{...gradientStyles.iconWrapper, ...iconProp?.style}}>
        {iconProp && iconProp.float === "right" && <MakeIcon 
            type={iconProp.type} 
            name={iconProp.name} 
            size={iconProp.size} 
            color={iconProp.color} 
          />}
      </View>
    </View>
  );
};

export const GradientButton = props => {
  const {onPress, text, buttonStyle, textStyle, textProp, bgColors, iconProp, containerStyle} =
    props;

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={{...gradientStyles.parentContainer, ...containerStyle}}
      colors={bgColors ? bgColors : colors.primary.gradient}>
      <TouchableOpacity onPress={onPress} style={{}}>
        {renderButtonContent(props)}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const gradientStyles = StyleSheet.create({
  parentContainer: {
    borderRadius: 14,
    borderColor: colors.primary.light,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  touchableContainer: {},
  wrapper: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  iconWrapper: {
    flex: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
