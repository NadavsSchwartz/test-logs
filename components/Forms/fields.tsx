import { classNames } from '@/utility/className';
import { getErrorFromUnknown } from '@lib-server/error';
import React, {
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useId,
  useState,
} from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Alert from '../Alert';
import showToast from '../Alert/toast';

type InputProps = Omit<JSX.IntrinsicElements['input'], 'name'> & {
  name: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      className={classNames(
        'mt-1 block w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800 sm:text-sm text-black',
        props.className
      )}
    />
  );
});

export function Label(props: JSX.IntrinsicElements['label']) {
  return (
    <label
      {...props}
      className={classNames(
        'block text-sm font-medium text-gray-700',
        props.className
      )}
    >
      {props.children}
    </label>
  );
}

export function InputLeading(props: JSX.IntrinsicElements['div']) {
  return (
    <span className="inline-flex flex-shrink-0 items-center rounded-l-sm border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
      {props.children}
    </span>
  );
}

type InputFieldProps = {
  label?: ReactNode;
  hint?: ReactNode;
  addOnLeading?: ReactNode;
} & React.ComponentProps<typeof Input> & {
    labelProps?: React.ComponentProps<typeof Label>;
  };

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(props, ref) {
    const id = useId();
    const methods = useFormContext();
    const {
      label = props.name,
      labelProps,
      placeholder = props.name + '_placeholder' !== props.name + '_placeholder'
        ? props.name + '_placeholder'
        : '',
      className,
      addOnLeading,
      hint,
      ...passThrough
    } = props;
    return (
      <div>
        {!!props.name && (
          <Label htmlFor={id} {...labelProps}>
            {label}
          </Label>
        )}
        {addOnLeading ? (
          <div className="mt-1 flex rounded-md shadow-sm">
            {addOnLeading}
            <Input
              id={id}
              placeholder={placeholder}
              className={classNames(
                className,
                'mt-0 ',
                props.addOnLeading && 'rounded-l-none'
              )}
              {...passThrough}
              ref={ref}
            />
          </div>
        ) : (
          <Input
            id={id}
            placeholder={placeholder}
            className={className}
            {...passThrough}
            ref={ref}
          />
        )}
        {hint && (
          <div className="text-gray mt-2 flex items-center text-sm text-gray-700">
            {hint}
          </div>
        )}
        {methods?.formState?.errors[props.name]?.message && (
          <Alert
            className="mt-1"
            variant="error"
            message={methods.formState.errors[props.name]?.message as string}
          />
        )}
      </div>
    );
  }
);

export const TextField = forwardRef<HTMLInputElement, InputFieldProps>(
  function TextField(props, ref) {
    return (
      <InputField
        ref={ref}
        {...props}
        className={classNames(props.className, 'text-black')}
      />
    );
  }
);

export const EmailInput = forwardRef<HTMLInputElement, InputFieldProps>(
  function EmailInput(props, ref) {
    return (
      <Input
        ref={ref}
        type="email"
        data-testid="email-field"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect="off"
        inputMode="email"
        {...props}
      />
    );
  }
);

export const EmailField = forwardRef<HTMLInputElement, InputFieldProps>(
  function EmailField(props, ref) {
    return (
      <InputField
        ref={ref}
        type="email"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect="off"
        inputMode="email"
        {...props}
      />
    );
  }
);

type TextAreaProps = Omit<JSX.IntrinsicElements['textarea'], 'name'> & {
  name: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextAreaInput(props, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={classNames(
          'block w-full rounded-sm border-gray-300 shadow-sm focus:border-neutral-800 focus:outline-none focus:ring-0 focus:ring-neutral-800 sm:text-sm',
          props.className
        )}
      />
    );
  }
);

type TextAreaFieldProps = {
  label?: ReactNode;
} & React.ComponentProps<typeof TextArea> & {
    labelProps?: React.ComponentProps<typeof Label>;
  };

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(function TextField(props, ref) {
  const id = useId();
  const methods = useFormContext();
  const {
    label = props.name as string,
    labelProps,
    placeholder = props.name + '_placeholder' !== props.name + '_placeholder'
      ? props.name + '_placeholder'
      : '',
    ...passThrough
  } = props;
  return (
    <div>
      {!!props.name && (
        <Label htmlFor={id} {...labelProps}>
          {label}
        </Label>
      )}
      <TextArea ref={ref} placeholder={placeholder} {...passThrough} />
      {methods?.formState?.errors[props.name]?.message && (
        <Alert
          className="mt-1"
          variant="error"
          message={methods.formState.errors[props.name]?.message as string}
        />
      )}
    </div>
  );
});

type FormProps<T extends object> = {
  form: UseFormReturn<T>;
  handleSubmit: SubmitHandler<T>;
} & Omit<JSX.IntrinsicElements['form'], 'onSubmit'>;

const PlainForm = <T extends FieldValues>(
  props: FormProps<T>,
  ref: Ref<HTMLFormElement>
) => {
  const { form, handleSubmit, ...passThrough } = props;

  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          form
            .handleSubmit(handleSubmit)(event)
            .catch((err) => {
              showToast(`${getErrorFromUnknown(err).message}`, 'error');
            });
        }}
        {...passThrough}
      >
        {
          /* @see https://react-hook-form.com/advanced-usage/#SmartFormComponent */
          React.Children.map(props.children, (child) => {
            return typeof child !== 'string' &&
              typeof child !== 'number' &&
              typeof child !== 'boolean' &&
              child &&
              'props' in child &&
              child.props.name
              ? React.createElement(child.type, {
                  ...{
                    ...child.props,
                    register: form.register,
                    key: child.props.name,
                  },
                })
              : child;
          })
        }
      </form>
    </FormProvider>
  );
};

export const Form = forwardRef(PlainForm) as <T extends FieldValues>(
  p: FormProps<T> & { ref?: Ref<HTMLFormElement> }
) => ReactElement;

export function FieldsetLegend(props: JSX.IntrinsicElements['legend']) {
  return (
    <legend
      {...props}
      className={classNames(
        'text-sm font-medium text-gray-700',
        props.className
      )}
    >
      {props.children}
    </legend>
  );
}

export function InputGroupBox(props: JSX.IntrinsicElements['div']) {
  return (
    <div
      {...props}
      className={classNames(
        'space-y-2 rounded-sm border border-gray-300 bg-white p-2',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export const PasswordField = forwardRef<HTMLInputElement, InputFieldProps>(
  function PasswordField(props, ref) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const toggleIsPasswordVisible = useCallback(
      () => setIsPasswordVisible(!isPasswordVisible),
      [isPasswordVisible, setIsPasswordVisible]
    );
    const textLabel = isPasswordVisible ? 'Hide Password' : 'Show Password';
    return (
      <div className="relative">
        <InputField
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder={props.placeholder || '•••••••••••••'}
          ref={ref}
          {...props}
          className={classNames('mb-0 pr-10', props.className)}
          addOnLeading={
            <button
              className="absolute bottom-0 right-5 h-9 text-gray-900"
              type="button"
              onClick={() => toggleIsPasswordVisible()}
            >
              {isPasswordVisible ? (
                <FiEyeOff className="h-4 stroke-[2.5px]" />
              ) : (
                <FiEye className="h-4 stroke-[2.5px]" />
              )}
              <span className="sr-only">{textLabel}</span>
            </button>
          }
        />
      </div>
    );
  }
);
