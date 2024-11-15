export const Select = ({ children, ...props }) => (
    <div className="select-container"> {/* Đặt div bên ngoài select để tạo card */}
      <select {...props}>
        {children}
      </select>
    </div>
  );
  
  export const SelectContent = ({ children }) => (
    <div className="select-content">{children}</div> // Sử dụng div ngoài <select>
  );
  
  export const SelectItem = ({ value, children }) => (
    <option value={value}>{children}</option> // Đây là phần tử hợp lệ trong <select>
  );
  
  export const SelectTrigger = ({ children }) => (
    <div className="select-trigger">{children}</div>
  );
  
  export const SelectValue = ({ value }) => <span className="select-value">{value}</span>; // Đây là phần tử hợp lệ
  