import { ApiUkey } from '@/api/user/ukey';
import Ukey from '@/views/common/ukey/Ukey.js';

const UkeyMixin = {
    data() {
        return {
            ukey: new Ukey('ws://127.0.0.1:10086'),
            // ukey: new Ukey('ws://192.168.50.52:10086'),
            ukeyOperatType: '',
            currentUser: '', // 当前操作的用户
        };
    },
    computed: {
        // 个人ukey 绑定的身份证号
        creaditNo() {
            const no = this.ukey && this.ukey.CN;
            const list = no && no.split('@');
            return list && list.length && list[1];
        },
    },
    beforeDestroy() {
        this.ukey.destroy();
    },
    methods: {
        // ukey 验证加密
        async encode(id) {
            try {
                const res = await this.ukey.signData(id);
                if (res.code === 0) {
                    return `${res.data}`;
                }
                return '';

            } catch (error) {
                console.log(error);
                return '';
            }
        },
        // 绑定ukey
        async handleBindUkey(index, data) {
            this.ukeyOperatType = 'bind';
            this.currentUser = data;
            const res = await this.checkUkeyState(data, this.ukeyOperatType);
            res && this.$refs.pinCode.open('绑定USB Key', true);
        },
        // 解绑ukey
        async handleReleaseUkey(index, data) {
            this.ukeyOperatType = 'release';
            this.currentUser = data;
            const res = await this.checkUkeyState(data, this.ukeyOperatType);
            res && this.$refs.pinCode.open('解绑USB Key', true);
        },
        confirmObj(message, title, obj = {}) {
            const defaultValue = {
                confirmText: '我知道了',
                hiddenCancel: true,
                type: 'warning',
                message,
                title,
            };
            this.$_confirm(Object.assign({}, defaultValue, obj));
        },
        // 检测ukey是否可用
        async checkUkeyState(data, type) {
            try {
                if (!this.ukey.deviceId) {
                    this.confirmObj('未检测到USB Key，请先插入后再进行操作', '插入USB Key');
                    return false;
                }
                const res = await ApiUkey.checkbind(this.ukey.deviceId);
                if (res === undefined) {
                    return false;
                }
                if (res && type === 'bind') {
                    this.confirmObj('检测到当前USB Key已绑定其他账号，请更换后操作', 'USB Key已绑定其他账号');
                } else if (this.ukey.deviceId !== data.ukeyNo && type === 'release') {
                    this.confirmObj('检测到当前USB Key与该账号已绑定的USB Key不匹配', 'USB Key不匹配');
                } else {
                    return true;
                }
                return false;
            } catch (e) {
                console.log(e);
            }
            return false;
        },
        // ukey pin code 验证通过
        async ukeyPassed(type) {
            const encodeData = await this.encode(this.ukey.deviceId);
            const data = {
                userId: this.currentUser.id,
                sign: encodeURIComponent(encodeData),
                data: this.ukey.deviceId,
            };
            const bindData = {
                userId: this.currentUser.id,
                cardNo: this.creaditNo,
                publicCert: this.ukey.cert,
                ukeyNo: this.ukey.deviceId,
            };
            await (type === 'bind' ? this.postBind(bindData) : this.postUnBind(data));
            await this.axios('/user');
        },
        // 绑定ukey
        async postBind(data) {
            try {
                const res = await ApiUkey.bind(data);
                this.$message.success('绑定成功');
                this.$refs.pinCode.close();
                this.$emit('refresh');
            } catch (e) {
                console.log(e);
            }
        },
        // 解绑ukey
        async postUnBind(data) {
            try {
                const res = await ApiUkey.unbind(data);
                this.$message.success('解绑成功');
                this.$refs.pinCode.close();
                this.$emit('refresh');
            } catch (e) {
                console.log(e);
            }
        },
    },
};

export default UkeyMixin;
