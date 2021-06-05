import classNames from "classnames";

interface InputGroupProps {
  className?: string;
  type: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
}
const InputGroup: React.FC<InputGroupProps> = ({
  error,
  placeholder,
  setValue,
  type,
  value,
  className,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        placeholder={placeholder}
        className={classNames(
          "w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white",
          { "border-red-500": error }
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="text-red-500">{error}</p>
    </div>
  );
};

export default InputGroup;
