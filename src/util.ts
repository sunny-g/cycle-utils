import props from 'ramda/src/props';

// returns an array of properties from an obj or, if wildcard is passed, an array of the input obj
export const pluckProps = (keyOrKeys: string | string[], obj = {}): any[] => {
  if (keyOrKeys === '*') {
    return [ obj ];
  }
  return props([].concat(keyOrKeys), obj);
};

export const pluckSources = pluckProps;
export const pluckSinks = pluckProps;

export const head = arr => arr[0];
export const tail = arr => arr.slice(1);

// alt for ramda/src/mapObjIndexed
export const mapObj = (valueKeyMapper) =>
  obj => Object
    .keys(obj)
    .reduce((newObj, key) => ({
      ...newObj,
      [key]: valueKeyMapper(obj[key], key, obj),
    }), {});
