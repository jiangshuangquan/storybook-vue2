import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    name: 'AuthStatusMixin'
})
export class AuthStatusMixin extends Vue {
    @Prop()
    inChangeRecard!: any; // 信息变更中的记录

    get getGoAuthTextByInChange() {
        if (this.inChangeRecard?.length) {
            const recard = this.inChangeRecard[0];
            const { basicInfoStep, auditMode, legalPersonStep, licenseStep, accountStep } = recard;

            return this.formatAuthText(
                basicInfoStep,
                auditMode,
                legalPersonStep,
                licenseStep,
                accountStep
            );
        } else {
            return this.getGoAuthText;
        }
    }
    // 下方按钮文案显示
    get getGoAuthText() {
        const { basicStep, auditMode, legalPersonStep, licenseStep, accountStep } = (this as any).authStatus;

        return this.formatAuthText(
            basicStep,
            auditMode,
            legalPersonStep,
            licenseStep,
            accountStep
        );
    }
    // 是否显示帮我认证
    get showHelpAuth() {
        const { basicStep } = (this as any).authStatus;
        const isUnsubmit = basicStep === 'UNSUBMIT';
        const isRejected = basicStep === 'REJECTED';

        if (isUnsubmit || isRejected) return true;
        return false;
    }

    formatAuthText(basicStep: string, auditMode: string, legalPersonStep: string, licenseStep: string, accountStep: string) {
        const isBaseAgree = basicStep === 'PASSED';
        const isOldChoose = ['QIYUESUO', 'PLATFORM'].includes(auditMode);
        const isUnChoose = auditMode === 'INDEPENDENT';
        const isLegal = auditMode === 'LP';
        const isAdmin = auditMode === 'SEAL';

        if (!isBaseAgree) return this.formatBasicStepText(basicStep);
        if (isOldChoose) return this.formatOldData(accountStep);
        if (isUnChoose) return '继续认证';
        if (isLegal) return this.formatLegalPersonText(legalPersonStep);
        if (isAdmin) return this.formatAccountStepText(licenseStep, accountStep);
        return '继续认证';
    }

    // 当处于基本认证阶段时的文案
    formatBasicStepText(basicStep: string) {
        const mapping = {
            UNSUBMIT: '立即认证',
            APPLIED: '查看认证进度',
            REJECTED: '重新认证'
        }
        return mapping[basicStep] || '继续认证';
    }

    // 当处于法定代表人认证时的文案
    formatLegalPersonText(legapPersonStep: string) {
        const mapping = {
            APPLIED: '继续认证',
            REJECTED: '重新认证'
        }
        return mapping[legapPersonStep] || '继续认证';
    }

    // 当处于线下盖章 + 打款认证时的文案
    formatAccountStepText(admin: string, accountStep: string) {
        const mapping = {
            'UNSUBMIT-APPLIED': '继续认证',
            'APPLIED-APPLIED': '查看认证进度',
            'REJECTED-APPLIED': '重新认证',
            'PASSED-APPLIED': '查看认证进度',
        }
        return mapping[`${admin}-${accountStep}`] || '继续认证';
    }

    // 兼容旧数据
    formatOldData(accountStep: string) {
        const mapping = {
            NONEED: '无需认证',
            UNSUBMIT: '立即认证',
            APPLIED: '查看认证进度',
            REJECTED: '重新认证'
        }
        return mapping[accountStep] || '继续认证';
    }
}
