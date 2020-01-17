import axios from 'axios'

export function request(config) {
    const instance = axios.create({
        baseURL: 'http://123.207.32.32:8000/api/hy/',
        timeout: 5000
    })

    instance.interceptors.request.use(config=>{
        console.log(config)
        return config
    },err=>{
        //console.log(err)
    })

    instance.interceptors.response.use(res=>{
        return res.data
    },err=>{
        return err
    })
    return instance(config)
}

/*export function request(config) {
    const instance = axios.create({
        baseURL: 'http://123.207.32.32:8000',
        timeout: 5000
    })

    instance(config.baseConfig)
        .then(res => {
            console.log(res)
            config.success(res)
        })
        .catch(err => {
            console.log(err)
            config.failure(err)
        })
}*/

/*export function request(config, success, failure) {
    const instance = axios.create({
        baseURL: 'http://123.207.32.32:8000',
        timeout: 5000
    })

    instance(config)
        .then(res => {
            console.log(res)
            success(res)
        })
        .catch(err => {
            console.log(err)
            failure(err)
        })
}*/
