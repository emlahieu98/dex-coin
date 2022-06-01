import styled from 'styled-components/macro';
import { Radio as R } from 'antd';
import { withFormContext } from '../Form/withFormContext';

const Radio = withFormContext(styled(R)``);
Object.keys(R).map(key => (Radio[key] = R[key]));
export default Radio;
