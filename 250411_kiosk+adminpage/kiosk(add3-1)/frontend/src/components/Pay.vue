<template>
  <div>
    <h2>결제</h2>
    <form @submit.prevent="submitPay">
      <input v-model="form.menuId" placeholder="메뉴 ID" />
      <input v-model="form.paymentMethod" placeholder="결제 수단" />
      <input v-model="form.amount" type="number" placeholder="금액" />
      <button type="submit">결제</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        menuId: '',
        paymentMethod: '',
        paymentStatus: 'PAID',
        amount: 0,
        paidAt: new Date().toISOString(),
        payId: 'PAY-' + Math.floor(Math.random() * 1000000)
      }
    }
  },
  methods: {
    async submitPay() {
      await axios.post('/api/pay', this.form)
      alert('결제 완료')
    }
  }
}
</script>