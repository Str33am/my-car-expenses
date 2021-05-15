import { Provider } from 'react-redux';
import store from '../src/store';
import AppRoutes from './components/routes/AppRoutes';

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes/>
    </Provider>
  );
}

export default App;
