<script setup>
import { ref } from "vue"


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
const selectedColors = ref(new Set())

function updateColorSet(color) {
  if (selectedColors.value.has(color)) {
    selectedColors.value.delete(color)
  } else {
    selectedColors.value.add(color)
  }
}

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
    title: 'Color',
    key: 'color',
  },
  {
    title: 'Quantity',
    key: 'quantity',
  },
  {
    title: 'Total',
    key: 'total',
  },
]

// on color change filter data property by color
const dataFilteredByColor = computed(() => {
  console.log(selectedColors)
  if (!selectedColors.value.size) return []

  const filteredData = data.map(item => {
    item.quantityByColor = item.colors.reduce((acc, color) => {
      acc[color] = 0
      
      return acc
    }, {})
    
    return item
  })
  
  return filteredData.filter(item => {
    const itemColors = new Set(item.colors)
    const intersection = new Set([...itemColors].filter(x => selectedColors.value.has(x)))
    
    return intersection.size
  })
})

const finalOrder = ref([])

const finalTotal = computed(() => {
  return finalOrder.value.reduce((acc, item) => acc + item.total, 0)
})

const addToOrder = (v, quantityByColor) => {
  console.log(v.value, quantityByColor)
  
  const item = v.value
  const orderItems = finalOrder.value.filter(order => order.name === item.name)

  Object.keys(quantityByColor).forEach(color => {
    const quantity = quantityByColor[color]
    
    if (quantity) {
      const orderItem = orderItems.find(order => order.color === color)
      
      if (orderItem) {
        orderItem.quantity += quantity
        orderItem.total = orderItem.quantity * orderItem.price
      } else {
        finalOrder.value.push({
          name: item.name,
          price: item.price,
          quantity: quantity,
          total: quantity * item.price,
          color,
        })
      }
    }
    quantityByColor[color] = 0
  })


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
        :class="{
          'border selected-color-item': selectedColors.has(color),
        }"
        :style="{ backgroundColor: color }"
        @click="updateColorSet(color)"
      >
        <VCardText class="py-11 px-15">
          <p class="icon-name text-capitalize text-truncate mb-0 pt-2" />
        </VCardText>
      </VCard>
    </div>

    <div v-if="selectedColors.size">
      <VCard title="Your Order Form">
        <VDataTable
          :headers="headers"
          :items="dataFilteredByColor"
          :items-per-page="10"
          height="300"
          fixed-header
        >
          <template #item.quantity="{ item }">
            <div style="display: flex;">
              <div
                v-for="color in item.value.colors"
                :key="color"
              >
                <input
                  v-model="item.value.quantityByColor[color]"
                  type="number"
                  name="quantity"
                  min="0"
                  max="10"
                  autocomplete="off"
                  class="colorBox text-center text-white"
                  style="width: 50px;appearance: textfield;appearance: none;outline: none;"
                  :style="{ backgroundColor: color, color: 'black', width: '50px' }"
                  @focus="$event.target.select()"
                >
              </div>
              <VBtn
                size="sm"
                class="px-2 mx-2"
                @click="addToOrder(item, item.value.quantityByColor)"
              >
                Add
              </VBtn>
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
            >
              <template #item.color="{ item }">
                <div
                  class="p-5"
                  :style="{backgroundColor: item.value.color, width: '50px'}"
                >
                  &nbsp;
                </div>
              </template>
            </VDataTable>
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

<style scoped>
.colorBox::-webkit-outer-spin-button,
.colorBox::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
}

/* Firefox */
.colorBox {
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -moz-appearance: textfield;
}

.selected-color-item {
  border: 1px solid white;
  opacity: 0.5;
}
</style>
