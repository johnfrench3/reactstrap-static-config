import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mapToCssModules, tagPropType, isObject } from './utils';

const colWidths = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const stringOrNumberProp = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
]);

const columnProps = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.number,
  PropTypes.string,
  PropTypes.shape({
    size: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
    ]),
    order: stringOrNumberProp,
    offset: stringOrNumberProp,
  }),
]);

const propTypes = {
  tag: tagPropType,
  xs: columnProps,
  sm: columnProps,
  md: columnProps,
  lg: columnProps,
  xl: columnProps,
  xxl: columnProps,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  widths: PropTypes.array,
};

const getColumnSizeClass = (isXs, colWidth, colSize) => {
  if (colSize === true || colSize === '') {
    return isXs ? 'col' : `col-${colWidth}`;
  }
  if (colSize === 'auto') {
    return isXs ? 'col-auto' : `col-${colWidth}-auto`;
  }

  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
};

export const getColumnClasses = (attributes, cssModule, widths = colWidths) => {
  const modifiedAttributes = attributes;
  const colClasses = [];

  widths.forEach((colWidth, i) => {
    let columnProp = modifiedAttributes[colWidth];

    delete modifiedAttributes[colWidth];

    if (!columnProp && columnProp !== '') {
      return;
    }

    const isXs = !i;

    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

      colClasses.push(
        mapToCssModules(
          classNames({
            [colClass]: columnProp.size || columnProp.size === '',
            [`order${colSizeInterfix}${columnProp.order}`]:
              columnProp.order || columnProp.order === 0,
            [`offset${colSizeInterfix}${columnProp.offset}`]:
              columnProp.offset || columnProp.offset === 0,
          }),
          cssModule,
        ),
      );
    } else {
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });

  return {
    colClasses,
    modifiedAttributes,
  };
};

function Col(props) {
  const {
    className,
    cssModule,
    widths = colWidths,
    tag: Tag = 'div',
    ...attributes
  } = props;

  let { modifiedAttributes, colClasses } = getColumnClasses(
    attributes,
    cssModule,
    widths,
  );

  if (!colClasses.length) {
    colClasses.push('col');
  }

  const classes = mapToCssModules(classNames(className, colClasses), cssModule);

  return <Tag {...modifiedAttributes} className={classes} />;
}

Col.propTypes = propTypes;

export default Col;
