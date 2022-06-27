/**
 * 定时器mixin
 * 用于控制接口轮询上限（30min）
 * 按需混入，逻辑上凡是轮询带登录态接口都应混入intervalId，统一清除
 * @authors 李其雄
 */
export default {
    data() {
        return {
            intervalId: null, // 轮询任务序号
            timerId: null // 定时任务序号
        }
    },
    beforeDestroy() {
        clearInterval(this.intervalId);
        clearTimeout(this.timerId);
    },
	created() {
        const INTERVAL_LIMIT = 1800000; // 接口轮询时间上限30min，与服务端session有效期一致

        this.timerId = setTimeout(() => {
            clearInterval(this.intervalId);
        }, INTERVAL_LIMIT);
    }
}
