import {createSlice} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';

const initialState = {
  employees: [],
  filters: {
    page: 1,
    size: 10,
    searchText: '',
  },
  loading: false,
  error: null,
  form: null,
};

const initialEmployeeForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  dateOfEmployment: '',
  dateOfBirth: '',
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action) => {
      const newEmployee = {
        ...action.payload,
        id: uuidv4(),
      };
      state.employees.push(newEmployee);
    },
    updateEmployee: (state, action) => {
      const {id, ...updatedEmployee} = action.payload;
      const index = state.employees.findIndex((emp) => emp.id === id);
      if (index !== -1) {
        state.employees[index] = {
          ...state.employees[index],
          ...updatedEmployee,
        };
      }
    },
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload
      );
    },
    setFilters: (state, action) => {
      state.filters = {...state.filters, ...action.payload};
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setSize: (state, action) => {
      state.filters.size = action.payload;
    },
    setSearchText: (state, action) => {
      state.filters.searchText = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        size: 10,
        searchText: '',
      };
    },
    setForm: (state, action) => {
      console.log('🔧 Setting form:', action.payload);
      state.form = action.payload || {...initialEmployeeForm};
    },
    resetForm: (state) => {
      state.form = {...initialEmployeeForm};
    },
  },
});

export const {
  setEmployees,
  addEmployee,
  updateEmployee,
  removeEmployee,
  setFilters,
  setPage,
  setSize,
  setSearchText,
  setLoading,
  setError,
  resetFilters,
  setForm,
  resetForm,
} = employeesSlice.actions;

// Selectors
export const selectEmployees = (state) => state.employees.employees;
export const selectEmployeeById = (state, id) =>
  state.employees.employees.find((emp) => emp.id === id);
export const selectFilters = (state) => state.employees.filters;
export const selectPage = (state) => state.employees.filters.page;
export const selectSize = (state) => state.employees.filters.size;
export const selectSearchText = (state) => state.employees.filters.searchText;
export const selectLoading = (state) => state.employees.loading;
export const selectError = (state) => state.employees.error;
export const selectTotal = (state) => selectFilteredEmployees(state).length;
export const selectForm = (state) => state.employees.form;

// Filtered employees selector
export const selectFilteredEmployees = (state) => {
  const {employees} = state.employees;
  const {searchText} = state.employees.filters;

  if (!searchText) {
    return employees;
  }

  return employees.filter(
    (employee) =>
      employee.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchText.toLowerCase())
  );
};

// Paginated employees selector
export const selectPaginatedEmployees = (state) => {
  const filteredEmployees = selectFilteredEmployees(state);
  const {page, size} = state.employees.filters;
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  return filteredEmployees.slice(startIndex, endIndex);
};

export default employeesSlice.reducer;
