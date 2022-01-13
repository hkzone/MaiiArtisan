const orderTable = (orders) =>
  `<table class="table table-sm ">
              <thead class="thead-light ">
                <tr>
                  <th scope="col" class=" text-left" >
                    Order
                  </th>
                  <th scope="col" class="optional-show">
                    Quantity
                  </th>
                  <th scope="col" >
                    Total
                  </th>
                  <th scope="col" >
                    Due Date
                  </th>
                  
                   <th scope="col" >
                    Customer
                  </th>
                   <th scope="col" >
                   Status
                  </th>
                   <th scope="col" >
                   
                  </th>
                </tr>
              </thead>
              <tbody>${orders.map(
                (order, index) =>
                  `                <tr>
                  <th scope="row" class= "text-left">
                      
                        <a class="" data-toggle="collapse" href="#collapse${index}">${order.orderItems.map(
                    (el) => el.product.name
                  )}</a>    
                 
                  </th>
                  <td class="align-middle optional-show">${order.orderItems
                    .map((el) => el.qty)
                    .reduce((a, b) => a + b, 0)}</td>
                  <td class="align-middle">${order.totalAmount}</td>
                  <td class="align-middle">${
                    new Date(order.dueDate).toISOString().split('T')[0]
                  }</td>
                   <td class="align-middle">${order.user.name}</td>
                   <td class="align-middle text-center">
                     ${order.isPaid ? '<span>paid</span>' : ''}
                     ${order.isReady ? '<span>ready</span>' : ''}
                     ${order.isDelivered ? '<span>delivered</span>' : ''}
                  </td>
                   <td>
                    <div class="dropdown ">
                      <a class="btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      </a>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item edit-order-status-ready" data-field="${
                          order._id
                        }" href="#">Mark as ready</a>
                        <a class="dropdown-item edit-order-status-delivered" data-field="${
                          order._id
                        }" href="#">Mark as delivered</a>
                      </div>
                    </div>
                   </td>
                  </tr>
                  <tr id="collapse${index}" class="panel-collapse collapse">
                     <td colspan="999">
                            <table class="table table-sm text-left">
                              <thead class=" ">
                                <tr>
                                  <th scope="col" >Product</th>
                                  <th scope="col" class="optional-show">Quantity</th>
                                  <th scope="col" >Color</th>
                                  <th scope="col" >Flavor</th>
                                  <th scope="col" >Message</th>
                                </tr>
                              </thead>
                              <tbody>
                  ${order.orderItems.map((el) => {
                    return `
                                  <tr>
                                    <td class="text-left">${
                                      el.product.name
                                    }</td>
                                    <td class="text-left">${el.qty}</td>
                                    <td class="text-left">${
                                      el.customColor ? el.customColor : ''
                                    }</td>
                                    <td class="text-left">${
                                      el.customFlavor ? el.customFlavor : ''
                                    }</td>
                                    <td class="text-left">${
                                      el.customMessage ? el.customMessage : ''
                                    }</td>
                                  </tr>
                                 `;
                  })}  </tbody>
                            </table>
                      </td>
                  </tr>
                </tr>
                `
              )}</tbody>
            </table>
        `;

export default orderTable;
