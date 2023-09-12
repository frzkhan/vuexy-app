<script setup>
import { ref } from "vue"

const hoveredCompany = ref(null)




const companies = ref([
  {
    name: '23',
    image: 'https://i.ibb.co/nj9ctCg/23.png',
    colorimage: 'https://i.ibb.co/nmYPqSP/23-Holds-colour.png',
    colors: ['#ff0000', '#ff00ff', '#00ff00', '#0000ff', '#800080'],
    hoverImage: null,
  },
  {
    name: 'Lapis',
    image: 'https://i.ibb.co/w7dz3xj/Lapis.png',
    colorimage: 'https://i.ibb.co/vQByfkX/Lapis-colour.png',
    colors: ['#ff0000', '#ff00ff', '#00ff00', '#800080'],
    hoverImage: null,
  },
  {
    name: 'Squadra',
    image: 'https://i.ibb.co/YQ1nMsm/Squadra.png',
    colorimage: 'https://i.ibb.co/dM4xjPs/Squadracolor.png',
    colors: ['#ff0000', '#ff00ff', '#00ff00', '#0000ff'],
    hoverImage: null,
  },
  {
    name: 'Polytalon',
    image: 'https://i.ibb.co/7yH6t6v/polytalon.png',
    colorimage: 'https://i.ibb.co/pRjw3wc/Polytalon-Black.png',
    colors: ['#ff0000', '#00ff00', '#0000ff', '#800080'],
    hoverImage: null,
  },
  {
    name: 'Unparallel',
    image: 'https://i.ibb.co/Hn7z6Y0/Unparallel.png',
    colorimage: 'https://i.ibb.co/DkYNk4p/Unparallelcolor.png',
    colors: ['#ff0000', '#ff00ff', '#00ff00', '#0000ff', '#800080'],
    hoverImage: null,
  },
  {
    name: 'Wide Boyz',
    image: 'https://i.ibb.co/QKM8yDy/WideBoyz.png',
    colorimage: 'https://i.ibb.co/mv3r29h/Wideboyz-Colour.png',
    colors: ['#ff00ff', '#00ff00', '#0000ff', '#800080'],
    hoverImage: null,
  },
])

const selectedCompany = ref(null)
const selectedColor = ref(null)

import { VDataTable } from 'vuetify/labs/VDataTable'
import data from './datatable'

const headers = [
  {
    title: 'NAME',
    key: 'name',
  },
  {
    title: 'CATEGORY',
    key: 'category',
  },
  {
    title: 'HOLD TYPE',
    key: 'hold_type',
  },
  {
    title: 'MATERIAL',
    key: 'material',
  },
  {
    title: 'HOLDS PER SET',
    key: 'holds_per_set',
  },
  {
    title: 'CLIMBING ABILITY',
    key: 'climbing_ability',
  },
  {
    title: 'COLOR',
    key: 'color',
  },
  {
    title: 'QUANTITY',
    key: 'quantity',
  },
]

const finalOrderHeaders = [
  {
    title: 'Product',
    key: 'name',
  },
  {
    title: 'Price',
    key: 'price',
  },
  {
    title: 'QUANTITY',
    key: 'quantity',
  },
  {
    title: 'Total',
    key: 'total',
  },
]

// on color change filter data property by color
const dataFilteredByColor = computed(() => {
  if (!selectedColor.value) return data

  return data.filter(item => item.colors.includes(selectedColor.value))
})

const finalOrder = ref([])

const finalTotal = computed(() => {
  return finalOrder.value.reduce((acc, item) => acc + item.total, 0)
})

const addToOrder = (v, quantity) => {
  quantity = parseInt(quantity)
  if (!quantity) return
  
  const item = v.value


  const orderItem = finalOrder.value.find(order => order.name === item.name)

  if (orderItem) {
    orderItem.quantity += quantity
    orderItem.total = orderItem.quantity * orderItem.price
  } else {
    finalOrder.value.push({
      name: item.name,
      price: item.price,
      quantity: quantity,
      total: quantity * item.price,
    })
  }
  console.log(finalOrder)
}
</script>






<template>
  <div>
    <h2>
      Order Sheet
    </h2>
    <div class="d-flex align-center flex-wrap mt-5">
      <VCard
        v-for="(company, index) in companies"
        :key="index"
        class="mb-6 me-6 text-center"
        :class="{
          'border': selectedCompany && selectedCompany.name === company.name,
        }"
        @click="selectedCompany = company"
        @mouseover="company.hoverImage = company.colorimage"
        @mouseleave="company.hoverImage = company.image"
      >
        <VCardText class="py-4 px-10">
          <img
            :src="(selectedCompany == company ? selectedCompany.colorimage : null) || company.hoverImage || company.image"
            width="40"
          >
          <p class="icon-name text-capitalize text-truncate mb-0 pt-2">
            {{ company.name }}
          </p>
        </VCardText>
      </VCard>
    </div>
    <div
      v-if="selectedCompany"
      class="d-flex align-center flex-wrap"
    >
      <VCard
        v-for="(color, index) in selectedCompany.colors"
        :key="index"
        class="mb-6 me-6 text-center"
        :style="{ backgroundColor: color }"
        @click="selectedColor = color"
      >
        <VCardText class="py-11 px-15">
          <p class="icon-name text-capitalize text-truncate mb-0 pt-2" />
        </VCardText>
      </VCard>
    </div>

    <div v-if="selectedColor">
      <VCard title="Your Order Form">
        <VDataTable
          :headers="headers"
          :items="dataFilteredByColor"
          :items-per-page="10"
          height="300"
          fixed-header
        >
          <template #item.color="{ item }">
            <VCard
              class="m-6 me-6 py-4 px-4 text-center"
              :style="{ backgroundColor: selectedColor }"
            />
          </template>  
          <template #item.quantity="{ item }">
            <div class="flex">
              <AppTextField
                v-model="item.quantity"
                type="number"
              >
                <template #append>
                  <VBtn @click="addToOrder(item, item.quantity)">
                    <span>Add</span>
                  </VBtn>
                </template>
              </AppTextField>
            </div>
          </template>
        </VDataTable>
      </VCard>
    </div>
    <div class="mt-10">
      <VRow>
        <VCol cols="8">
          <VCard
            v-if="finalOrder.length"
            title="Order Details"
          >
            <VDataTable
              :headers="finalOrderHeaders"
              :items="finalOrder"
              height="300"
              fixed-header
            />
            <VCardText class="py-4 px-10">
              <div class="my-2 mx-sm-4">
                <table class="float-right">
                  <tr>
                    <td class="text-end">
                      <div class="me-5">
                        <p class="mb-2">
                          Subtotal:
                        </p>
                        <p class="mb-2">
                          Discount:
                        </p>
                        <p class="mb-2">
                          Tax:
                        </p>
                        <p class="mb-2">
                          Total:
                        </p>
                      </div>
                    </td>

                    <td class="font-weight-medium text-high-emphasis">
                      <p class="mb-2">
                        ${{ finalTotal }}
                      </p>
                      <p class="mb-2">
                        $00.00
                      </p>
                      <p class="mb-2">
                        $00.00
                      </p>
                      <p class="mb-2">
                        ${{ finalTotal }}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="4">
          <VCard
            v-if="finalOrder.length"
            title="Customer Details"
            class="mb-5"
          >
            <div class="d-flex align-center pb-5">
              <VAvatar
                size="30"
                class="me-3 mx-5"
              >
                <VImg src="/src/assets/images/avatars/avatar-3.png" />
              </VAvatar>
              <div class="d-flex flex-column">
                <h6 class="text-body-1 font-weight-medium mb-0">
                  Customer name
                </h6>
                <span class="text-sm text-disabled">customer@email.com</span>
              </div>
            </div>
          </VCard>
          <VCard
            v-if="finalOrder.length"
            title="Shipping Address"
          >
            <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row">
              <div class="text-sm">
                <p class="mb-0">
                  Office 149, 450 South Brand Brooklyn
                </p>
                <p class="my-2">
                  San Diego County, CA 91905, USA
                </p>
                <p class="mb-0">
                  +1 (123) 456 7891, +44 (876) 543 2198
                </p>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </div>
</template>
