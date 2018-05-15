import React, {Component} from 'react';
import { Select } from 'antd';

const Option = Select.Option;

function handleChange(value) {
    console.log(`selected ${value}`);
}

class SelectLeft extends Component
{
    render()
    {
return(
        <div>
            <Select style={{width:'150px' }} >
                <Option value="1">1999</Option>
                <Option value="2">2000</Option>
            </Select>

        <Select style={{width:'150px'}} >
        <Option value="1">第一卷</Option>
        <Option value="2">第二卷</Option>
        </Select>

        <Select style={{width:'150px' }} >
        <Option value="1">第一篇</Option>
        <Option value="2">第二篇</Option>
        </Select>


        </div>
    )
    }

}

export  default  SelectLeft