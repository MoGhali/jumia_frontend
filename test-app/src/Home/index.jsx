import React, { useCallback, useEffect, useState } from "react"
import { Table, Tag, Space, Select, Radio, Image } from 'antd';
import qs from 'qs';
import "./index.css";
import {
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: '15%',
    },

    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,

        width: '15%',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        width: '15%',
    },

    {
        title: 'Country',
        dataIndex: 'country',
        width: '15%',
    },
    {
        title: 'Country Code',
        dataIndex: 'countryCode',
        width: '15%',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: validity => (
            <>
                {
                    validity === "Valid" ? <Tag icon={<CheckCircleOutlined />} color="success">
                        VALID
                    </Tag> : <Tag icon={<CloseCircleOutlined />} color="error">
                        INVALID
                    </Tag>
                }
            </>
        ),

    },
];

const options = [
    { label: 'All', value: "all" },
    { label: 'Valid', value: 'true' },
    { label: 'InValid', value: 'false' },
];

const getRandomuserParams = params => {
    console.log("paramm", params);
    return ({
        size: params.pagination.pageSize,
        page: params.pagination.current - 1,
        code: params.code,
        validity: params.validity,
        // ...params,
    })
};


const Home = (props) => {

    const [data, setData] = useState([]);
    const [countries, setCountries] = useState([]);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [isLoading, setIsLoading] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)


    const fetchData = useCallback((params = {}) => {
        setIsLoading(true);
        fetch(`http://localhost:9090/api/customers?${qs.stringify(getRandomuserParams(params))}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setIsLoading(false);
                setData(data.content);
                setPagination({
                    ...params.pagination,
                    total: data.totalElements,
                    // 200 is mock data, you should read it from server
                    // total: data.totalCount,
                });

            });
    }, [])

    const fetchCountries = useCallback(() => {
        fetch(`http://localhost:9090/api/countries`)
            .then(res => res.json())
            .then(data => {
                console.log("countries =====>>", data);
                const defaultOpt = [{ id: "0", code: null, name: "All Countries" }];
                setCountries(defaultOpt.concat(data));
            });
    }, [])


    useEffect(() => { //onMount
        fetchData({ pagination })
        fetchCountries();
    }, [])

    const handleTableChange = useCallback((pagination, filters, sorter) => {
        fetchData({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            code: selectedCountry,
            validity: selectedStatus,
            ...filters,
        })
    }, [selectedCountry, selectedStatus]);


    const onChange = useCallback((value) => { // onChange country code
        console.log(`onChange ${value}`);
        fetchData({ pagination: { ...pagination, current: 1 }, code: value, validity: selectedStatus })
        setSelectedCountry(value);
    }, [selectedStatus]);


    const onChangeValidity = useCallback((e) => { // onChange validity
        console.log('radio3 checked', e.target.value);
        const _selectedStatus = e.target.value === "all" ? null : e.target.value;
        fetchData({ pagination: { ...pagination, current: 1 }, code: selectedCountry, validity: _selectedStatus })
        setSelectedStatus(_selectedStatus)
    }, [selectedCountry]);



    const onSearch = useCallback((value) => {
        console.log(`onSearch ${value}`);
    }, []);


    return (
        <div>
            <div className="topDivHolder">
                <div>
                    <Image
                        width={200}
                        src="./jumia-pay.png"
                    />
                </div>
                <div>
                    <Radio.Group
                        // style={{ marginTop: "5px" }}
                        options={options}
                        onChange={onChangeValidity}
                        defaultValue={"all"}
                        size={"large"}
                        // value={value3}
                        optionType="button"
                    />
                    <Select
                        style={{
                            width: "250px",
                            marginLeft: "20px",
                        }}
                        size="large"
                        showSearch
                        placeholder="Select a country"
                        optionFilterProp="children"
                        defaultValue={"All Countries"}
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            countries.map((country, index) => {
                                return <Option key={index} value={country.code}>{country.name}</Option>
                            })
                        }
                    </Select>
                </div>
            </div>
            <div className="tableHolder">
                <Table
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={pagination}
                    loading={isLoading}
                    onChange={handleTableChange}
                />
            </div>

        </div>
    )
}
export default Home;