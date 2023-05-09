type ValidVariantTypes = string | number | null | boolean | undefined;
type Variants = Record<string, ValidVariantTypes | ValidVariantTypes[]> & {
  className: string;
};

export const applyStyleToMultipleVariants = (variants: Variants) => {
  const allKeysThatAreArrays = Object.keys(variants).filter((key) =>
    Array.isArray(variants[key])
  );
  const allKeysThatAreNotArrays = Object.keys(variants).filter(
    (key) => !Array.isArray(variants[key])
  );
  // Creates an object of all static options, ready to be merged in later with the array values.
  const nonArrayOptions = allKeysThatAreNotArrays.reduce((acc, key) => {
    return { ...acc, [key]: variants[key] };
  }, {});

  // Creates an array of all possible combinations of the array values.
  // Eg if the variants object is { color: ["blue", "red"], size: ["small", "medium"] }
  // then the result will be:
  // [
  //   { color: "blue", size: "small" },
  //   { color: "blue", size: "medium" },
  //   { color: "red", size: "small" },
  //   { color: "red", size: "medium" },
  // ]
  const cartesianProductOfAllArrays = cartesianProduct(
    allKeysThatAreArrays.map((key) => variants[key]) as ValidVariantTypes[][]
  );

  return cartesianProductOfAllArrays.map((variant) => {
    const variantObject = variant.reduce((acc, value, index) => {
      return { ...acc, [allKeysThatAreArrays[index]]: value };
    }, {});

    return {
      ...nonArrayOptions,
      ...variantObject,
    };
  });
};

export const cartesianProduct = <T extends ValidVariantTypes>(sets: T[][]) =>
  sets.reduce<T[][]>(
    (accSets, set) =>
      accSets.flatMap((accSet) => set.map((value) => [...accSet, value])),
    [[]]
  );
