import { reactive } from 'vue'

export const userStore = reactive({
    permissionIds: [] as number[],
    username: '',
    setPermission(ids: number[], name: string) {
        this.permissionIds = ids
        this.username = name
    },
    clear() {
        this.permissionIds = []
        this.username = ''
    }
})