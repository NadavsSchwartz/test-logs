import { classNames } from '@/utility/className';

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import ReactSelect, {
  GroupBase,
  InputProps,
  MenuPlacement,
  OptionProps,
  Props,
  SelectComponentsConfig,
  components as reactSelectComponents,
} from 'react-select';

export type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group> & { variant?: 'default' | 'checkbox' };

export const InputComponent = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  inputClassName,
  ...props
}: InputProps<Option, IsMulti, Group>) => {
  return (
    <reactSelectComponents.Input
      inputClassName={classNames(
        'focus:ring-0 focus:ring-offset-0',
        inputClassName
      )}
      {...props}
    />
  );
};
export const OptionComponent = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  ...props
}: OptionProps<Option, IsMulti, Group>) => {
  return (
    // This gets styled in the select classNames prop now - handles overrides with styles vs className here doesnt
    <reactSelectComponents.Option {...props}>
      <div className="flex">
        <span className="mr-auto">{props.label}</span>

        {props.isSelected && <FiCheck className="ml-2 h-4 w-4" />}
      </div>
    </reactSelectComponents.Option>
  );
};

const getReactSelectProps = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  components,
  menuPlacement = 'auto',
}: {
  components: SelectComponentsConfig<Option, IsMulti, Group>;
  menuPlacement?: MenuPlacement;
}) => {
  return {
    menuPlacement,
    components: {
      Input: InputComponent,
      Option: OptionComponent,
      ...components,
    },
    unstyled: true,
  };
};
export const Select = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  components,
  menuPlacement,
  variant = 'default',
  ...props
}: SelectProps<Option, IsMulti, Group>) => {
  const reactSelectProps = React.useMemo(() => {
    return getReactSelectProps<Option, IsMulti, Group>({
      components: components || {},
      menuPlacement,
    });
  }, [components, menuPlacement]);
  return (
    <ReactSelect
      {...reactSelectProps}
      classNames={{
        input: () =>
          classNames(
            'dark:text-darkgray-900 text-gray-900',
            props.classNames?.input
          ),
        option: (state) =>
          classNames(
            'dark:bg-darkgray-100 flex cursor-pointer justify-between py-2.5 px-3 rounded-none text-gray-700 dark:text-darkgray-700',
            state.isFocused && 'dark:bg-darkgray-200 bg-gray-100',
            state.isSelected &&
              'dark:bg-darkgray-300 bg-gray-200 text-gray-900 dark:text-darkgray-900',
            props.classNames?.option
          ),
        placeholder: (state) =>
          classNames(
            'text-gray-400 text-sm dark:text-darkgray-400',
            state.isFocused && variant !== 'checkbox' && 'hidden'
          ),
        dropdownIndicator: () => 'text-gray-600 dark:text-darkgray-400',
        control: (state) =>
          classNames(
            'dark:bg-darkgray-100 dark:border-darkgray-300 !min-h-9 border-gray-300 bg-white text-sm leading-4 placeholder:text-sm placeholder:font-normal  focus-within:ring-2 focus-within:ring-gray-800 hover:border-gray-400 dark:focus-within:ring-darkgray-900 rounded-md border ',
            state.isMulti
              ? variant === 'checkbox'
                ? 'px-3 py-2'
                : state.hasValue
                ? 'p-1'
                : 'px-3 py-2'
              : 'py-2 px-3',
            props.classNames?.control
          ),
        singleValue: () =>
          classNames(
            'dark:text-darkgray-900 dark:placeholder:text-darkgray-500 text-black placeholder:text-gray-400',
            props.classNames?.singleValue
          ),
        valueContainer: () =>
          classNames(
            'dark:text-darkgray-900 dark:placeholder:text-darkgray-500 text-black placeholder:text-gray-400 flex gap-1',
            props.classNames?.valueContainer
          ),
        multiValue: () =>
          classNames(
            'dark:bg-darkgray-200 dark:text-darkgray-700 rounded-md bg-gray-100 text-gray-700 py-1.5 px-2 flex items-center text-sm leading-none',
            props.classNames?.multiValue
          ),
        menu: () =>
          classNames(
            'dark:bg-darkgray-100 rounded-md bg-white text-sm leading-4 dark:text-white mt-1 border border-gray-200 dark:border-darkgray-200 ',
            props.classNames?.menu
          ),
        groupHeading: () =>
          'leading-none text-xs uppercase text-gray-600 dark:text-darkgray-600 pl-2.5 pt-4 pb-2',
        menuList: () =>
          classNames(
            'scroll-bar scrollbar-track-w-20 rounded-md',
            props.classNames?.menuList
          ),
        indicatorsContainer: (state) =>
          classNames(
            state.selectProps.menuIsOpen
              ? state.isMulti
                ? '[&>*:last-child]:rotate-180 [&>*:last-child]:transition-transform'
                : 'rotate-180 transition-transform'
              : 'text-gray-600 dark:text-darkgray-600' //
          ),
        multiValueRemove: () =>
          'text-gray-600 dark:text-darkgray-600 py-auto ml-2',
        ...props.classNames,
      }}
      {...props}
    />
  );
};

export default Select;
