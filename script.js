function addItem() {
  const itemsDiv = document.getElementById("items");
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <input type="text" placeholder="Serial No" class="serial" />
    <input type="text" placeholder="Description" class="desc" />
    <input type="number" placeholder="Quantity" class="qty" oninput="updateTotal(this)" min="1" />
    <input type="number" placeholder="Unit Price (LKR)" class="unit" oninput="updateTotal(this)" min="0" />
    <input type="number" placeholder="Total Price (LKR)" class="total" readonly />
    <button onclick="this.parentElement.remove(); calculateTotal();">Remove</button>
  `;
  itemsDiv.appendChild(div);
}

function updateTotal(input) {
  const item = input.closest(".item");
  const qty = parseFloat(item.querySelector(".qty").value) || 1;
  const unit = parseFloat(item.querySelector(".unit").value) || 0;
  const total = qty * unit;
  item.querySelector(".total").value = total.toFixed(2);
  calculateTotal();
}

function calculateTotal() {
  const totals = document.querySelectorAll(".total");
  let total = 0;
  totals.forEach(p => total += parseFloat(p.value) || 0);
  document.getElementById("total").innerText = total.toFixed(2);
  return total;
}

function generatePDF() {
  const customerName = document.getElementById("customerName").value || "N/A";
  const address = document.getElementById("address").value || "N/A";
  const refId = document.getElementById("refId").value || "N/A";
  const date = document.getElementById("date").value || "N/A";
  const bank = document.getElementById("bank").value || "N/A";
  const branch = document.getElementById("branch").value || "N/A";
  const accountName = document.getElementById("accountName").value || "N/A";
  const accountNumber = document.getElementById("accountNumber").value || "N/A";
  const senderName = document.getElementById("senderName").value || "N/A";
  const senderPhone = document.getElementById("senderPhone").value || "N/A";
  const senderTitle = document.getElementById("senderTitle").value || "N/A";
  const signatureInput = document.getElementById("signature");
  let signatureBase64 = null;

  const logoBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAEbAVQDASIAAhEBAxEB/8QAHQABAAEFAQEBAAAAAAAAAAAAAAkBAgUHCAMGBP/EAGIQAAECBAMDBAkSAgQICgsAAAEAAgMEBREGBwgSITEJQVG1ExkiOFhhcYGWFBYYMkJVV3Z3hZGUoabR09TVFSMXUrHBJCUzNTZiorImJzRydYKSldLwKENTVFZlZnOls+H/xAAcAQEAAgIDAQAAAAAAAAAAAAAAAQIGBwQFCAP/xAAvEQACAQMDAgMIAgMBAAAAAAAAAQIDBBEFBjESISJBcQcTFDIzNUJRFWEjkbGB/9oADAMBAAIRAxEAPwCVNERAERRt5o8sTN5c5p40y0ltNEWses/EFQoTp6Hiww/VHqaZiQRFMMSLux7fYy7Z2nWva5tdASSIote3cVW1/YlTdvjg79vTt3NU8Eua9MHft6AlKRRa9u5qnglzXpg79vTt3NU8Eua9MHft6AlKRRa9u5qnglzXpg79vTt3NU8Eua9MHft6AlKRRa9u5qnglzXpg79vTt3NU8Eua9MHft6AlKRRa9u5qnglzXpg79vTt3NU8Eua9MHft6AlKRRa9u5qnglzXpg79vTt3NU8Eua9MHft6AlKRRa9u5qnglzXpg79vTt3NUPDSXNemDv29ASlIote3cVXj7Eqb9MHft6qOW2q54aSJzp/0vd+3oOCUlFFseW3qzSA7STNgu4A4wdv/wDx6qeW1rA46SJzjb/S93H/ALvTghST4ZKQii17dxVfBKm/TB37enbuap4Jc16YO/b0JJSkUWvbuap4Jc16YO/b07dzVPBLmvTB37egJSkUWvbuap4Jc16YO/b07dzVPBLmvTB37egJSkUWvbuap4Jc16YO/b07dzVPBLmvTB37egJSkUWvbuap4Jc16YO/b07dzVPBLmvTB37egJSkUWvbuap4Jc16YO/b07dzVPBLmvTB37egJSkUWvbuap4Jc16YO/b07dzVPBLmvTB37egJSkUWvbuap4Jc16YO/b1ZF5b+fgMMWNpQmIbG8XOxk4Aec09ASmovlMp8df0oZWYNzM/hf8M9duH6dXfUXZ+zepfVUtDjdi7Jst29nsmztbLb2vYXsvq0AREQBERAEREAUeXJ6U2nT+qjWW6ek5aOYWPxs9mhB5ANRrF9m/Dg36FIao/OTnY1+qfWfcbxj9tjz/5yrKhg7rhYdw/xNEp5DiS3/BGbh0cF6et7D/vFT/qrPwWSa0Aki/FXKoMX63sP+8VP+qs/BPW9h/3ip/1Vn4LKIgMX63sP+8VP+qs/BPW9h/3ip/1Vn4LKIgMX63sP+8VP+qs/BPW9h/3ip/1Vn4LKIgMX63sP+8VP+qs/BPW9h/3ip/1Vn4LKIgMX63sP+8VP+qs/BPW9h/3ip/1Vn4LKIgMX63sP+8VP+qs/BUdh7DwH+Yqf9VZ+Cyqsiu2W3UPuiG0u7MQaHQNsAUKQ+qs/BYjE7cIYZpM3WqjR6ZDl5WE5+26BDF7C5HBfSxXhhsLb+dch6u82HTcx/R5R44DYdo025ni9yftXbaXp1TUrqNKPHmY5uTWI6Dp87mq/E+DR9UzgjS2cUDMD1FBEr6pMN0uIDOxmBvHC3nUgeDn4PxdQZLEdMpVPiS07AbGZaXhmwcL793FRYYiexjWNBux42g7o8S6d0SZ2ep51+VlbmjskmPIOed1z7gH6Ny+O4FGyv3bx8kjXWx91Vbq5dK8faTyjtIYew97xSH1Vn4I3D2Hzf/EVP+qs/BfsEcuAc0bQvY2Xqxx2nNJvY9C4LeUmbnT6u6Mf63sP+8VP+qs/BPW9h/3ip/1Vn4LKIoLGL9b2H/eKn/VWfgnrew/7xU/6qz8FlEQGL9b2H/eKn/VWfgnrew/7xU/6qz8FlEQGL9b2H/eKn/VWfgnrew/7xU/6qz8FlEQGL9b2H/eKn/VWfgnrew/7xU/6qz8FlEQGL9b2H/eKn/VWfgnrew/7xU/6qz8FlEQGL9b2H/eKn/VWfguWuU+o1HlNDWZUxK0mTgxWfwbZfDgNa4XrEkDYgdC65XKvKj94nmb8y9cSSlA2rpO71jJv5P8AD3V0BbVWqtJ3esZN/J/h7q6AtqqwCIiAIiIAiIgCj95OXvp9aHx/b1lWVIEo/eTl76fWh8f29ZVlQwSAjiVVUHEqqqAiIgCIiAIiIAiIgKE2Fym0EIuLK1xARptdiG8clS8AXVkZ7RDJPBXGwC/NOzUCUlXx45DWMFyXcBZSoyfhXJWc4wi5z+VHwWcuY0ll/hGdqUSOGx3w9mC3nL7bgBzqOasVmpV2ozNYqUfskzORXRYjib3J3keRbU1JZpx8wcZmQkI1qZTXFkKx3PcNxcfOSFqF7QANluyOYdC3FtHSlZ0eua8UkeaN/wC4J6nf+4UvBHgwOJCR2JwYNlp3sv4lj6HWqjh6pytcpMd0GckYgjwXt3EOBvs+RfuxK7e0dJWB2rCy1DvPNPV5tf0dDp1adKMZw7NMlYyLzTkMy8B0+uS8UGZawQ5uHzteBbh9C2XBiOcCXEbjuI5woztKOccxltjVtLqUQ/wqsOEB4c7uYV+DvOQApKpCagx5SFGl3NfCe0FjhzjmXCtayqw78npHa+sR1a0ik/FHk/YHtJsCm0OCt7kd0FVpa4rl4XkZKn3xIuBuqq1quVSwREUAIiIAiIgCIiALlXlR+8TzN+ZeuJJdVLlXlR+8TzN+ZeuJJSgbV0nd6xk38n+HuroC2qtVaTu9Yyb+T/D3V0BbVVgEREAREQBERAFH7ycvfT60Pj+3rKsqQJR+8nL30+tD4/t6yrKhgkBHEqqoOJVVUBERAEREAREQBERAUPBebhchXvOy0leT4zRYbJN1MM9XYq49fhRSI+17GwbxWgNUmbMPCOFjQKfMF1Rqd4YYHbxD90T5QVufFddkMOUWbrE/HbDhS8IvJJ+gKNvMrG87mFiucxJOve1sV5hwoRP+Sa0kgdHOsq2npEtQufeVF2i8muvaFuH+LtHQpS7yWD5MlzorzHJfFiv2zde0V21u8a83OcQQ4Dfz86DuWtFybdK3S4RpYVPhI8215uvP3kn3MBiUd02/SsCvoMTEXYfGvnxuNyvOO9/us/8Aw7yyf+FH6GxmwdiND9uzuh4iOBUhGjvOqHjfB4w3VJx0WpUoNhnsrrueyxt9FlHefbbY8wX2uVGYdSy2xnJ4nkC8QobgyYhMP+UaSL7uHMsXtKzhNJ8GZ7X1iWjXMcS8MuSW5hDmtN+5VW9y9YLBuI5DFeHpGt0yYbFgTUFsVrgbjfxX0BA3uB4LIqcsrJ6Dp1FcUo1Y+ZVt7q9WMIdvCvU5yffOe4REUAIiIAiIgCIiALlXlR+8TzN+ZeuJJdVLlXlR+8TzN+ZeuJJSgbV0nd6xk38n+HuroC2qtVaTu9Yyb+T/AA91dAW1VYBERAEREAREQBR+8nL30+tD4/t6yrKkCUfvJy99PrQ+P7esqyoYJARxKqqDiVVVAREQBERAEREAREQFkX2hsvCLEDBtEgNA3r9EQXYQta5z5kSOXWDJysRHgTLoZhyrDxdEIs0fSQvvb287mpGnDls4Wo3tPT7aVxUeMGgdXWbDpuZbl9SpghgIfOFp43Fw37QfMuXX2ZxdtOfuJ6be686/RWKvPV2pzFWqMVz5iZiGK8k3NzzeZfj/ALty3toWlQ061jj5nyeUdyazV1m8nVm/D5FTvG5V5gqO4KvuQu4/CRjkeTA4m9x5VgFn8Te48qwC8373+6T9EZDZfRQVzRe7dojb7i/RfnVqqNkggnfzLEHnCwctPDydg6I87HSM0csK5M7MI3fTi87zu3s+wnzruNpa9gc03uoaKFW57DtWlatT4jmTErGbFhuabEEG/FSk5EZpSWaGB5KsQo7TNtYIU0wHeyKBY38pBXc2Nx1LoZunY2vfEUvg68u64NpNAA3BXLzgkFlxw5l6LsmbJCIigBERAEREAREQBcq8qP3ieZvzL1xJLqpcq8qP3ieZvzL1xJKUDauk7vWMm/k/w91dAW1VqrSd3rGTfyf4e6ugLaqsAiIgCIiAIiIAo/eTl76fWh8f29ZVlSBKP3k5e+n1ofH9vWVZUMEgI4lVVBxKqqgIiIAiIgCIqHgnAKbZ/qqyJG2Gl2zewuVUkBeMV3dNIPtb7um6rKpGCUn5jDeUWTdQhwJWJHiWaxrC+9+ZR/aks04mYmMotJp0yYlKpzj2JodcOi33n7GroPVJmycHYaiYepkxap1NpZ3J3w4fOf7Fw8473HfYO7IHni5y2Rs/RJSfxc16GkPaTuSM4/x9KXr6lj2hptz8/lQC7Uc7bO10q4e1utouPS8Gk5pqCyWu4KvuQqO4KvuQq/hIpDkwOJvceVYBZ/E3uPKsAvN+9/uk/RGQ2X0UEsEVzd4KxHOEcplu47ibBby0qZuxss8dQqZU5kw6RVyGRmF1g19wGRPoJ3eNaOFgRfeAvQuIvEa4gmx2hxZbhZWt6jhPJ2mm3r0+6hVTwkTM06chTcuJiE8PbEG2CDx3L9QiXFwFzRo+zqbjfCTMNVqODWaS3YIc7fEZbcfHzro+HEALRb24LlktOanFM9G6TqENSto1ovu0e7YhcbFtl6KwAW2grhwVs98HYpNclUREJCIiAIiIAuVeVH7xPM35l64kl1UuVeVH7xPM35l64klKBtXSd3rGTfyf4e6ugLaq1VpO71jJv5P8PdXQFtVWAREQBERAEREAUfvJy99PrQ+P7esqypAlH7ycvfT60Pj+3rKsqGCQEcSqqg4lVVQEREARETICoeCb+hWucQ0mychvBQgeNYLGGJJDClEmq1UYrYcGVhOeXE24Dh5+Cyzo7924AD23SuPdXubbp2ZGAKZMtAhWfMmGeJv7U+S1/Ou00bTJ6pdRoJdkY3unW6eiae68nhvg0VmTjifzDxdOYinYpMF0RzJcf1GA2A89gV8rEiX3BWud3Ww32uz9vSrVvmzt42lJUY/ieUb66lf3Mris+7ABKrfdZVa/ZFrK3iV9lFuWWcNyzyVdwVfchUdwVfchW/CQhyYHE3uPKsAs/ib3HlWAXm/e/wB0n6IyGy+igqgngOdUTxrD5LKOX28xsu43VzXWCbZtZWqO6XYhLq+Y+xyszCqGWuNZDEkjGLIfZWsmbH/1V+6+wlSpYIxRT8XYekq5TI4iy83DbFY4G/EcPMofQNsFhtbifGuvtEudD6bPvy1rE6x8CM7aknRCdprjv2RzW3n6F2VhcYfTI2PsbXfhq6tKr7Pg7nbuG9ejTcLwEUuaXNG625esK5aCeK7ns+6N1uWWXoiKSQiIgCIiALlXlR+8TzN+ZeuJJdVLlXlR+8TzN+ZeuJJSgbV0nd6xk38n+HuroC2qtVaTu9Yyb+T/AA91dAW1VYBERAEREAREQBR+8nL30+tD4/t6yrKkCUfvJy99PrQ+P7esqyoYJARxKqqDiVVVAREQBEVBvG9OwBIHEq15Bad9wqnja4X5p2bhyktFmYxa2HCaXOJO4ADerKDn2RSdSNOPVI1/nTmTJ5a4OmqtGisE05hhy7CbbTiN39ijnrFUnq3UJmq1GIYs1ORDFivcbm56FtfUdmmcwsZxafKRyaXIXhbIO5xG4u+kfatOjc+xPlW4NqaKrO295JeNnmnfm5ZaxfOjTf8AjhwG7mbIba3G/OrV6xrbtleSzNcGuXLqfUEHFEHFSiCruCr7kKjuCr7kKPwkWhyYHE3uPKsAs/ib3HlWAXm/e/3SfojIbL6KCIixDyOUEREAIJsBYb96yNAqc3QaxK1+lxHwZuSiCIxzTY7ljl6wogbudwTr908n3p1p0ZKrS5RKjkDmfK5pZfyFbgRgY7R2KO2+8PAF7/StpQ3BzLjpUY+lnOCLljj1ktUpl4pNaLZWJBv3MFxNmP8AOXb/ACKTCmTUOdk4UzBe10OI0Oa5puCDwKyC1q+8hk9B7V1qOq2cU34lyfrREXKMpCIiAIiIAuVeVH7xPM35l64kl1UuVeVH7xPM35l64klKBtXSd3rGTfyf4e6ugLaq1VpO71jJv5P8PdXQFtVWAREQBERAEREAUfvJy99PrQ+P7esqypAlH7ycvfT60Pj+3rKsqGCQEcSqqg4lVVQEREBQmwVhJB47leeC/O53dEk8FD7vpIlLpWS+K54s4EdHBc/6ps3hgvDvrbpkwBUKmxzLjeWQyLE28e8LcuLcQymG8PzdbnIrYcOXhF+0425uCjbzHxrPZg4pnK9NxXPhxYjhAaTubDHBv03PnWWbU0iepVvfSXhia69oO4/4m0+GpvxyPlzFeYhiuO053Enn8qsuiLdEIRprwrB5olOUpOTfdlS4kWVERWKBBxRBxUoFXcFX3IVHcFX3IUfhItDkwOJvceVYBZ/E3uPKsAvN+9/uk/RGQ2X0UERFiHkcoIiIBchN5RVFr71DWeScuPBURoheHbRDmkEEbiCOCkP0c52jG2D24Uq82H1ajN2HOPF8K/cnzAtCjtcN9wvs8pcf1PLTHFOxLIRXdja8NmIV90SHzg/Z9C5lnWdOeG+xlO1tbek3S7+F9sEuMGLEcSHPBsOFvtXoHO3r5rBOKqZjHD0piGkR2xZeahB7XjnFuFuIX0O2Nm/PxXfpqUco9B0aquKUa0OGe4vYXVVaz2oVyH25CIiALlXlR+8TzN+ZeuJJdVLlXlR+8TzN+ZeuJJSgbV0nd6xk38n+HuroC2qtVaTu9Yyb+T/D3V0BbVVgEREAREQBERAFH7ycvfT60Pj+3rKsqQJR+8nL30+tD4/t6yrKhgkBHEqqoOJVVUBFab9KtBJ51GXnGA8IvX5Yzyxm00BzgbtHi51+i7ulayztzGlcucHzVTjRx6pjNdDl2X3l53WHm3rk29tK4rRpw5ZwtQvYafbSuKnCRz/q6zZi1Kc/o8oU6exwh2Secx3PzN+0rmIneRDZsseNw6F+mp1Seq9SmKtORXPjTMR0QuO83JuQvyXLnbTjcre+i6dHTLaNOHPmeUNx61V1q8nWm/Cn2KIlir2w9o7iu2bS5MceF5liL1dAc0X4qwbuLFX3kP2TjPeLyWoOKvJaRzDxK0C53H6EU0R0vkO4KvuQhYedU32tvO9TKSUG2THkwWJvceVYBfQYkBAYSBxWBABO8ELzfvdr+Un6IyGy+ii1FW1lVpA9sAsQUk0cpdy1FftM/qhWkjmCZQKIgV4LP6qNpEuL/RYr77cLsZNme7POrSLncqEG9iN3Oq5bfYLEWpeaOutEedcWRnomW1emtmFHvGkXxHcLjezf5B9K7nhPEVvZGgcwPjUONJrU3QqpK1iQjuhR5WKIwe02IsQSfsUoGn/NORzRwFJVNkdhnITBDmWX3hw3XPlAv5139hcKoulm6di687un8NVfdG1xw3Kq82kFo2XX3Ku/hddh0myM98F6Kx17cd6uHBRjAz3wVXKvKj94nmb8y9cSS6qXKvKj94nmb8y9cSSIk2rpO71jJv5P8PdXQFtVaq0nd6xk38n+HuroC2qrAIiIAiIgCIiAKP3k5e+n1ofH9vWVZUgSj95OXvp9aHx/b1lWVDBICOJVVQcSqqoPNzjwVL7IuRuVTYXVjiOBO7oRScY5ZTpTmeU1OQpWC+PGfsNZcknmHSo9tRmaMxmNjF8lKRS6mU4lkEA8SCbuI6ebyLofVTmw7CmH4mHaXN7FRqLex7jvYwjj9q4fdckva4te8kvJ51snZ2idb+Kqr0NI+0bdLlJWFF8ZyXbiwP5zzdC82nukBPtSN3MelV2Vsz8+hGku6byVeRzFWg7wAe66FVpbzrK0XD9dxBHErRaVOTTnGwMGE5wv0Egbl8K1xSt49VZnLtqNWvJU6UMtmNcYzbMN7u4BW9ka0lsRwaeg8633gvSFj/EDYcxWosvSIL7Ei4c9w8YBuFvDCmkLAVGZDi1QRahHb7bbcNg+ayxm63fp9q3GC6mZjp/s91W/xNw6YnDkCUmJgBzJKK7a4EMO9fT0XKjMHEDREouEZ+Ya7g9sPcpE6Dlxg7DUMMpGH5WDsi3csA/tWegysvC3NgtaeYADcsdud+VMtUaeDN7P2S0UlK5rP0I+ZDS/m/UGgmgiWv8A+3cW/wBgKzcto5zSigGM+nsvvI7M7d/srvAwmHg0ecK9rQBYN4eNdXPet/NYTR31L2YaRHlP/ZwRV9DmY9QYww5+nAg3IMd//hXz8xoWzdgm0CNS3jxx3/8AhUjB/wDtj6VTsd+It51h2oyeqV3Xr/MzsIez3SqcemKf+yMaqaQM7qWe4w2J0D/3Zxd/aAvjqzklmnh9j4lWwPUoLGcXdjuB9qln7CxoG61/6q8I9PloxHZIMNxP9Zt118tOptYicWv7O7GccUm0yG2YlJiVcWTEpGhubuLXMIIXi18N29v0KXmv5YYKxPD7HW8OSU2CLfzIYWm8aaJcrsQOiTFKlY9JjkdyJV4bDB8hBP2riVNNl5GO3vs6r0lmjLJHUGh28EedWEb9193QulcdaH8xsOiLM4am5Ssy7AXiC7+W4fS7eVoKu4WxNhuZfJ4gos7IxYZILY8JzGD/AJpIsfMuJO0lT5MQvdDvtNz71djEsIvcq4kG6sNuZU38F8k1nB0bi28sBpcdnjtbj5Fu3TBm9MZW46l5KaiP/hVUeIEVoN9k8xsfItLwm2aXk2tzo2LEDmOaS17HbbHDmKvSrOjLKOz0u+qWF1G4pvsuSZiSnJadl4czKxWvhxGhzXNO4jpC/Tt3BtzLl/R3nP688MQsIVWZ/wAZ0lgY0OO98IDcfsK6da7mtxF1kdKp1pM9G6TqMdWtVWh+j0DjbaV4NxdWBvc2V7eC+zOyj8pVcq8qP3ieZvzL1xJLqpcq8qP3ieZvzL1xJKEWNq6Tu9Yyb+T/AA91dAW1VqrSd3rGTfyf4e6ugLaqsAiIgCIiAIiIAo/eTl76fWh8f29ZVlSBKP3k5e+n1ofH9vWVZUMEgI4lVVBxKqqg8XXu6xt5VgcYYkkcK4fm6xPxmshy8Nzy53k3fas1EeXHZ5mm7t/ALjvV3msalUYeA6NNbUGXftT7mHxbmf7puu20bTZaldRoR4Mb3TrlPRNOlcSfd9kaFzHxtP5g4tnK9OPdsRYjocME3DYd9xHRuXzDgRuO8cFe0Mc3Z47Pcg3tu6F6SsnNVCaZJSUvEjxopDYbGNLiT5uC3pQt4aZRVJvCieWLm4rapdOcVlyZ5w3NY3aLgDzHjbzLPYUwNirG06KZh2jRZh7iLvsexjx3W9MpNJdRrAhVfHThLSrtl3qVo/mEH/W4D6F1hhPBGHsGU5lPoVOhS8Bgt3Dd5PSVh+s7yp2snCz7s2Ftr2dV72Sq3vaL8jmzLrRzCg9hnsbzz5iICD6mhNs3yE7iulcNYGwzhWTbK0Wjy0psgd02GLnynpWchvLnOaLgg23iw83SvYM2m2PTda7vdXutRfVVbNz6Rtex0aOKcU36HlFiQJZhc98OG0Wu97tkL8tOr9GrEWLBpdUl5t8H/KtgvDti/C60xrZpldntN2MpmgVKNKVGQkHTEGJAJBNnAW+grh/km8x6xM5pYrwlXanGmxU5GFEl/VETbIcwxHPI8osuq6+rgyGMenglabYtG5Nho5lSE0NYGhoaBzBXONgSoJFh0Ll7lAc+axkbkvFnsLVL1JX6tMslJI7LSdk7nuF+i4XT3Zfbdye5t51ERyqOZcfG+dFIywpZixoNGszYhNJ2piIQC3dz3aEwgfk0i68M3Z3O6j0fMjFxqNGqkb1FFY+G1rYTi0kOBA6QB51L+CyIAWvGy7coLNTGQM5ppqmAK3TNpkKrU+DUeyXtszIcXbJ8dmqXrS7mjAzdyQwzjIzDI0y6UbCm3teHWjsa3bvbxoDbMRhf3DSRcA7vKuZ9Xus2n6WqrhqnzWGn1hta7LEmBCfaJBhsLRuFwDfaXTYt7bnP2KGTlTsYvxJqMdQZaKIsGiSMOECHXsYjWl4HnapXIJQ9POoPC2orBvr2wtDmpaDCiGXjy8djQ5kSwPMTzELaMeIyHCMaJGYxjACXPdYDyqLXkh8yTTMT17K+amGBk7LicgsPF0UHuv8AZYut+UJzAnsvdNlcqFMnoklOz0ZkjAiQ3WiNe9ryHA/9VWB0gx8GYPcDbG8F4IIt0rB4ty+wljKnxpCvUKTnWRWbO0+GNseR1rjzLi3ksMW5l45wjiGv44xZUKtJQJgSkoJlxdYtDSSCebuuC7yIJe5xDbC2zu38FSUFLsfGvb0qkcVIppnGmaWhiXmez1HAFRMGJveJOPcM8gcLlcoYzy7xjl/UXyGKqDMSxhGxiObZpHMRbxKXoDaG0L/+fEvncXYCwvjmRfTsRUiBNw3tIu9oLh5OhcSrYxkuxgur7Ftr1OrQeJEQl3EENb3J4EqzeCL8y6vzq0VVOgmPiDLcPmJQ3fEk4m+I0f6p3X8llyvOyM7T52LIVCViy8xBcWvhxWFrgR0g710tW1lRkal1HRLnTKrhWjiP7PqMqswalltjeRxRS3kmE9rJhhcbPhX3t8pF1KtgXFlMxnhyTxBTY7I0GbgteC03seceY3Ch+7kM7FZu4ktNrG54k/3LrTRNnT/BZ9+XNemWtgzPdyj3OsA+/tRfxXK5dhcdL6ZGXbG19Wlf4Oo/C+Du47xxsr28F+YRNuxDLi/TzL9IFgu7x5o3Z25RVcq8qP3ieZvzL1xJLqpcq8qP3ieZvzL1xJIgbV0nd6xk38n+HuroC2qtVaTu9Yyb+T/D3V0BbVVgEREAREQBERAFH7ycvfT60Pj+3rKsqQJR98nQ5rdUutAu/wDj9vWVZUPshjJIECASjnADivIuYWg8y/LOTMGXgRo8eJssYwvMQ8GgcVCXU0lyys5qKb/R8BnjmRL5dYQm6qyI31W9rocuy+9z7blHZVKrOVapTNUqEUumJp5iPcTcuuf/ACPMtmai80ouP8ZxpKVmXOo9PiOhwgDdr3g+2+xfgyiyZxBmpU2bEv2CnQyDHmSLAi/BvjW29Bs6Og2buLntJrJ503hf3G5dTVnbd4p4wv8Ap83gvL7EOYdVhU+iyDyz3UQA2+ldvZP6dsO5ey0OcmoEOcqLgC6LEbfZPiuvtcvstsPZeUWHS6NIw2ANG2/dtRD0lfatAsN1lh+t7nr6hJwpvEf+mxtq7GoaVTVW5XVU9OD8wYyG3ZawDZG6/Cy5R1Acodk/kpXoeE4EV9cqTI7Yc5Altxl2X7pxuRwFyutogBG9QMawcGTg1eYvwpAYBGqNchwZXa3AmJsNbv6LlYp+XUbHgowWEiavKjNzBucOFJTFmC6tCnpWYDXFjXDbg7uDgvumG/49KglyyzSzp0NZqOplThxpeAIu1OyTmOEKahX4tF9+4+23jf41MLkHqFy/z9whL4lwjUYbpjY/wmRLwYsB9t4HOR47I1JvkJJH3GYNBl8S4KrVAmYQiQ56SiQnNI47v/4oVtHuII+UOsClyM04wYbahFpLwd1+yHYF/wDtKcF94kF7LF7YjTuPHfzKDvVdSXZOazqlOyYMFkCswqtLgc8Exbn/AHCmEuATlwnbcMO2g6/AhXEA8VgMDViHiDBlDrMGJttnabLTFwd/dQmk/wBq963ifD+H5d0xWa3JSTIftjMRmt828qAWYur8DDOF6riGOQ1khKRI7iTYdyFBpgrG+E8y9XcLM7MCvQ6dQ5qvGpxok05xYIbYoda2+wsVJZyjGdEtgTTlNwKPPQ4kfFDmyUF0N1w5h7u4tzWao99K2hXE2pqhVDEcHFcvRKfJRhAY6NKmKIpF7kWc3xIDpXlAs39M2c+TsnT8GZpUacruH4wiycOGx5c9ti3Y3s4d0V+HkkM42llYyfqU2xsRznT0lBvuNr9lAv5Wr87OR0rAgxHRM4pQuHCG2lvDT0W/mdK5cy9m61pB1XycCtTj9ihVr1FNxywwxHlhEs5wvzODboCdqoTcORkZidiEWgQnPP8A1RdQkwKdB1B67H0uoQzMSlQxK+DG33AgNjEfRYqXLOPHUnQ8hq/jiWjs7C+jviQYgduIissN/lcox+S4wlGxhqMqGOpuF2QUuXjxHPPNEe5pb/ulSDXWXUaf0r61palxXOhNplZ/hUYHcHQ4wAH/AOxdS8rvmA0UHBWCJaaBg1VsSouAPF0MtDfsiFay5VTLiPgnOWjZl0uFssrbWxDEA9rNQyXf7rWrQeoDOWJqFxZgiHDjxJg02kydOa03N5hsOG2L/tNKnIJSuTkwQzCmmPD80+EGOrpdUSbWNiA3f/2F03PTkrISsadnJiFBgwm7bokR2y1oHOSvlcocMMwdljhrCzIQAkKdChAea/8AeuB+U51XVGkR3ZGYHqDoBjMYavHhv3Pa5txCuOff9iqxzybhza5TbIzLesx6JS3TmIY0q4sjRJFrS1rhzDacLr2yj5TTIjMmowqLWHTuGZyZfsQP4i1obEJ4WLHOsuTNGnJ1/wBMOHIeY+a81MSlKn3bUjKQn2iPh2BJ336ehfY6sOTOw/gfBE7j3JyoTbDR4PqiYko523vaN200i28XHMiyiHFeRJpITElU5WHNyM1CmJSMwPhxGP22vB5wVpjPDTDhTNWVizstLNp1YhgmDNQWgF56HAbiPKuSeSx1I1+sVicyNxZUYk1CkZQRaT2RxJhhod2Rjb8wDWqS8gHcOi6rVhGqsNHC1DTqGpQ93XjlERGZOV2LMrqw+jYokTsh5ayZYDsPtzgr5yj1SdotVlqtIxC2NJxWxIbwbEEf+bKWPM3LHDOZtDj0TENNZHY5p7HEIG1Ddb2zT0qObO7IjE+TtZ7DNSzpikTLj6mnGNOy0byGxD07uey6W5tZUZdUO5pjcO17jR6nxNt3gn/o750/ZrSuaWA5KrujsM9CY2FOQxxbHA7oeS62y14IUYOl7N+YyyzCgSs9NWpFVcIUyL9xCfewd0c5Ul8hNy89Kw5mUeHw4zREa4HcQQu0taqqww+UbL2trFPULJRbzOJkCQFyryozgdCmZgH/AMm64kl1LYOaBzWXK3KhsDdCuZlj7zdcSS5JlLbWDbWk7vWMm/k/w91dAW1VqrSd3rGTfyf4e6ugLaqsSEREAREQBERAFH5ydDQ7VLrQaefH7esaypA1H5yc+7VNrPPRmA3rGsqGs9iG8LKO+9nZYRzAXXPOqzNr1p0BmE6VGtUas0gbJ/ycPfcn6PtW7MZYlkcKYfnK5UIrWQZaGX7zbaIFw0eMrhnDuGsUaksyZuqR40U05sxeI8g7MOXG7YB6SbGyyLb9jGpJ3lXCjT/Zg28dTrRgtPsvq1P15GNyUyWq2aFbEaOIkvRIL7xY5bcvdffa67vwdguh4MpcOmUeWZBhQWgbIHE/1ir8I4RoeDqPAolHk2QYMsxrQ0AAnduJ8a88b42wtlth6dxdi6rwKfTpKHtRY0V4aB0N38SSRu8a+Ot65X1Wr0J4iffau1KOi0ffV1mq/M+iY1tnP2rm3EL3DuIFtwXD8DlV8hHYj/gz5Wrsk2xjCfPGA4Mte17W4eddi4Sxbh3G1BlMTYaqUCdkZxgfBjQYgc1wPjC6HCi+lGZJuSzLkzW0XN3iyhs5R+luwlq3p2IWjYMyZafLzu3timx/2VMmYjbXAvzblFRyv2H2y+PMLYnaCPVUiJUEc5a97uPnQk6G1Q5YZK5xaeqRijH9ckMPVU0OUjStTfbskRxgNNhYEkX6Qotco858bZC49ZiLAlXfFhwZixhMeRBmoYO/uTwFr8wK2RlTk5qV1fzNLp7JyrTuGqTCZKS89OxHNlpVrAG7LQdzrBvMRwXd1A5K/J6UytnMOVaNMzuJp2AXMqoeAYMYC42Nxs0ncRfeFcG7dL2q/A2o/DLJ6mzMOTrkuxsOep8R4DxEtZzmC+9tx9oXBnK4YFNMzPoGYMtCEOFVZRki2IQd8SGS5wPmiBUyG0EanMAZ4sm6FUG4ekqJFIFVDjsx4G0DsgXG1fcSL8QpKMfZG4CzclKJAzUw/K4hfRSYsJkxDBhGI4AOdsm/9UKrBENRdZWrCrYRp+X+BXTsGWkIDZaC6TlQ97mgWHdOb/ev3UbTRrdz2mGVCvvrsCHG3mZnpt0OFfmuxjv7lMJhHKzL7AsCHBwhg2k0iHDuGtlJVsMDf4l9S+GXG99/C43EedQDhXM/QhmHndl9gLCuJ8eS1Mi4Up5gTMOGXvbGjbTrOJc0m4a6y6T0zZD07T1ldI5fSs76vdLkxI80WgGM8gX5hu3bvKtqNY+G7dcw7WN95JvxXs1rrAvdcjxIDzA4lxIDjvHisuPtSfJ1YP1CZiPzBiYtn6JGiwWQokKWhMexzm+7O0DvK7FJeTw7nyIWgi2yNnoQHMeduQOPqrpPmcjcEVx1TqUOXhywnJw7D4rWRGv3bItewsvhOTd03Y2yGouKpjMSjGRqVQmoLIYJBuxgeCQR03C7RfDLrOEPbFyTtcRu5ldChu2QDctuHd1xQHIfKb5XevnT5NVySl3RKhh+YZNwNkXOy5zWvv5G3Ki60f4QhY71F4IoT4fctqTYseEG3Gw1w2ndG8kKe/EeHaXi+jTWHq/JNmafUILoEeC8XDmniCtI5c6H8kcqMyZbMrA1KnpCblYL4TJdswBABc5puGBo/qoDd1Wnf4FhydqAALadIxIoH/MYT/coMMOUOp6ltXgoc9MPjQqtX4xil2/ZhiK6x8wsFOjiWnPq2HqnSQQHzslHlxf/AF4Zb/eoS8ia9KafdZ0ONjVhlJSXrU1LxXxRsbEMxjsv38xAG/xoCa/DeHqdhegyVBo8u2BKU+E2XhQ2NADQBvIXli6gxcQYWqeH5cshxJ+ViQGxIg2mN2um91+6mVilVSmQavT5+FHkYkLssOMx4LCy1734L5XCOcuXGPMQVfDOFMTSlQqFEIbNwoMdrg3h0HmuB5UBxBpW0E5oaf8AUnKY4q1Qkp2gtk5uA2PKucSNphDNraA33PMpGB3LW342svKEAxznB3c8A0cAV6viQ2MdFiuDWsF3EncAgPCOGnceLd4JPHpWAxjg2g44osxQ67JsmZWZhlpD272npB4grlDU/wAozgnJ3F8rgzCsOFWpyDMsZUo0J4fDgwtqzwCAe6AvuXU+XeO8P5nYMpmLsOz0KPJ1KC2LDiQ3g77d0DbnBBHmVcLGGfKrRhcRdKqsxZHXqA0/VvJ6tviynZI9BjEul44HA8zSRvBXUWjfOcY0wy/CNVjtNSo7A1hLt8WFu37+cXt5lvfG2B6LjqhzVArslCjy0w3Za1wHcH+sPGo/sR4TxPpXzZkq/KPiimxI14MSxEN7CSHMJ4cLlddKm7ap1LhmuqmlvbWoq9o/SfKJJIT3iCC9vEkjyLlvlRO8UzL+ZuuJJdD4FxfTcaYXkcRU2MyJBnYTYgs69iRe3lXPHKiuvoVzL6D/AAa3/fEku0i8xNiUayrwVWPEjbOk7vWMm/k/w91dAW1VqrSd3rGTfyf4e6ugLaqsfYIiIAiIgCIiAKPnk63BmqfWc482YDesaypBlF7pQx8zAGfGtOehtMSdm8wBLykJvtokQ1GsCw8l7r6UabqzUF5nwubiNrSlWlwjpLUHiOp5oYvk8ncJPiOayJ2SfjQz3LQCOJ8xW9stcvqTl5hqVo8hAhtcyGOzxGts6I7xlfJZD5UxMKU6LiDE387ENVcY8zFPuQ73I6Lb1tsF22YZ4Wsuff3ipwVrS+Vc/wBsxrR9Nm7iWoXveU/l/pH556PI06Xi1CoRGwJWDDL4sV7rCG0e2JKiG1m6hsVarM25PJrLQTMahyU4JWAyXP8Ay5+8Oiu5tltzxt7RdScprnVmBgHLqFg/CVJm2U+uXgTtUhgkNbYB0PcN19o33rmbku8VZLULH88/HsWDCxXMs7FTI0w4FjASCQL+1ce6+ldWlgywyOcHJkuyzyImsyIWNDGxBQ5P1ZUJdzf5ToTW3cG3b7bd5FntDus/AGR2S8/R8ysRx40eDUXMkZQNvFbC2Gndu2bX2udfb8ptqxlKXh+YyGwVOtmpupQb1aPDdtCDCcNzN3G4JuN1rLVOnTkwajmVgGFjfMXEMShx56AYklLCCXFoI7l7t449CMHf2ROrvJ3P5joOCsQWqLLXkpgbMUnxbrHzFcy8rtQfVOXWE8Qta1jZafiQnki5Z3I/FcLupuMdIGpCBTxOOdOUGebED2OLfVEAuu12zzbQANlMpm3knhLUhgCkUDGxislNuXn3hhsXHuSW38dredVBo7krK2ajp0fT+wBsWQqMYF+wW9ka+I8g/Qu0IQAZ3PDmXy+XWV+CsqsPQcMYIo0KnyMDg1gG07/nEAXX1QAHBAVREQBERAEREAREQBERAEREB5RDd+zbgLk9C4c1zaEGZ1RHZi5bQ4cDFUJn8yWb3LZpoHAc21uHOF3M5gdxvbo6VTsMOwGwO54ICBmp0fWZgCXi5dTkHGcrLQXGE2VY7aY8Hdue0kgeddJaAdJWetNzHlM2cUzM5henSzjEiwIkQufUgTva4Ha5+m3BSnxZGWmNoR4fZAeZ28DyLHV+tU3DNLmqvWpiDJ0yRhdkjR4jw1rGAcSTw6EB7RZ+FIwIs5UJmBLwILOyxYrnbLGt5zv8nOo2tbnKKbMWeyuyUqA7IwOgztWZwcOBZCvz7+JHMd61/rX5Qap5nzc1lrlBHiwcPOeYEzPwSQ+eubdiFuA85vtLTdO0L51z2TE5nRM0zsEOVb2aXknwyY74N7l9uI3/AIoD9uRGhzNvP3C1Ux+9szTZAS0WYkpmcO1FnowaS1ovfntvNuPFbS0K6mKzp6zGnckcz3xIFGnpzsBbHJ/wKYFgHN6AbcP9Zbw5NLVZK4rw1K5GYxjsg1ilw9imxHO/ysFos1t+ci32rHcpLpDi1eViZ5Zb04MqUrsxaxLwG7JjbO4RrjnFm7+gICRKDHl5qXZMQnw4sOJYsew3DgeBXw+bGV1BzOwvOUGry7CYzSYMYi5hRBwcOjeFzbya+fuLc0ssnYVxjT5wzGH2tgS9Rc09jmYdiB3R4kbI33512YIRIs4Cx+1RKCmu5xrq3jc03Tlwzj3TZiqs5QY8nsj8cR3WMUxKbHfuZEFzcg9Bu3cs3yoDxF0JZlPuD/mY7v8ApiSX3mpDJx2M6I3E2GGCXxLRgY0lHaN7rb9g9I3Bc86zczIWYfJzZiumNmFVZAUaWn5cnu4cRtYkt5HNfcvnTTg8HUaYp2VV2kvlXB1NpO71jJv5P8PdXQFtVaq0nd6xk38n+HuroC2quQZAEREAREQBERAFGjoWwBTsYaw9WVYqV4jKDmDFiw4B9q+JEqNWAcfIGH6VJco/eTl76fWh8f29ZVlTGTg+qPJ86tKNaDhPhne8qx7IeyWWN17FhuDs716DiVVUznktCChFR/R8xjbL3C+YlAnsNYqpUKckp+GYb2RGg7O4i46DvUQWsLQ3jXT1XnY7y9bOTmGYsYvhxJYfzJJ3Hfbfbx7+KmkWNxBQ6biOlR6NV5Nk1KTTDDiwntDg5p5t6ZLEFGkSNl3i3URRarnpXXRpKDGERkSdcSI8VrhstieI778FM3mlmng3JnK+ex7PVCWh0yTltuUZDc3YikgBkNg4neRwUb2tvk+KngOYn8zMnKbEmaE3am5+RYD2WU5y5tvccegDcuY5HHWeOf3reyO/jNQrUGUmmy8pLXcSzpLt54AknxBM5BtjJDBOLdbOqWPjmsSMRtJE56qmozh3MKE1/wDLhbv9Un6FNLTpaHKSktLQXdxDY1gFuOyLf3LT2lXTtQdOuWcnhmRgw/4rMNbGqUzsjafFIuQD0AkgLdDWgFu6zGbm+NQD3REQBERAEREAREQBERAEREAREQBERAF81j/BlJx9hWqYRrkExJGrS7oEUBxHHgd2/iAvpV+aYfYubs7Ttm7W34jnQEFmPcspzR1qKk4WLcPtrNBkJ4TEq6Iw9jmIO3vPNc2G5TNZZYywfmtl3T8Q4bhSkek1SSaxsCHbZaCLOhkcxFiPMtcav9NFH1F5YTNKgy8NtdpkN0ekzWz3YiAX7GTxsS0DzrgDRDqRrmmPNGdyZzQfNQKFMzfqaLDjk/4BM3ADm39y7eeb2yAu1o6ccTaZM4ZHOLKNk1K0moznZZUSrS5snH2gQw7idkkgc/BSW5EYnq+beSVHquOcNRJObqcj2KdlZto/mby0uIB4OAv519xWaFh/F8gJOs02UqMkIjJhrI0MPhusbtcL7rrLSMKFLgS0vDayHBYGNaG2AHMB4rIDCYPwFhbAFLhUPB1Al6XIwgdmFAaAAfGTvK+ga11u64heypYdCkjHfJ4xGOiWaWNc33QPFcIcpFk7K4U0vZtY7olUmZaBVBR/VlPaG9hiO/i0mA7hcb7HceZd7LlTlRx/6CmZh/6F64kkR8p0Y1GpPlG1tJ3esZN/J/h7q6AtqrVWk7vWMm/k/wAPdXQFtVWPsEREAREQBERAFFTpX1RZFabNU+rX+mrHXrc9ceP438M/xZOTnZ/U9RqvZv8Ak0KJs7PZoXtrX2t17G0qy1pVtMmm2v1Wdrtd0+Za1GpVGYiTc5OTeE5CNHmY8RxdEixIjoRc97nEuLiSSSSUBp8cqNoUF/8Ajz+7NY/SKvbR9Cfw5/dmsfpFtX2J2ljwacqvQ2nfkp7E7Sx4NOVXobTvyVGAaq7aPoT+HP7s1j9IqHlRdCTuOeXD/wCmaz+kW1vYnaWPBpyq9Dad+SnsTtLHg05VehtO/JTANSRuU70EzMF0vMZ1w4sJ4s5j8L1hwcOggym8LTGA9R/JdZd5n1PNTDea8KBU58kw4frXrHY4BIs4tHqTid/0rsL2J2ljwacqvQ2nfkp7E7Sx4NOVXobTvyUwDVDeVE0Jtv8A8ed+j/gzWP0ir20XQlfa/py3/FmsfpFtb2J2ljwacqvQ2nfkp7E7Sx4NOVXobTvyUwDVXbR9Cfw5/dmsfpE7aPoT+HP7s1j9Itq+xO0seDTlV6G078lPYnaWPBpyq9Dad+SmAaq7aPoT+HP7s1j9InbR9Cfw5/dmsfpFtX2J2ljwacqvQ2nfkp7E7Sx4NOVXobTvyUwDVXbR9Cfw5/dmsfpE7aPoT+HP7s1j9Itq+xO0seDTlV6G078lPYnaWPBpyq9Dad+SmAaq7aPoT+HP7s1j9InbR9Cfw5/dmsfpFtX2J2ljwacqvQ2nfkp7E7Sx4NOVXobTvyUwDVXbR9Cfw5/dmsfpE7aPoT+HP7s1j9Itq+xO0seDTlV6G078lPYnaWPBpyq9Dad+SmAaq7aPoT+HP7s1j9InbR9Cfw5/dmsfpFtX2J2ljwacqvQ2nfkp7E7Sx4NOVXobTvyUwDVXbR9Cfw5/dmsfpE7aPoT+HP7s1j9Itq+xO0seDTlV6G078lPYnaWPBpyq9Dad+SmAaq7aPoT+HP7s1j9InbR9Cfw5/dmsfpFtX2J2ljwacqvQ2nfkp7E7Sx4NOVXobTvyUwDVXbR9Cfw5/dmsfpFaeVD0IuIcc8d4NwfWzWf0i2v7E7Sx4NOVXobTvyU9idpY8GnKr0Np35KYBqd3Kh6EiO5zyAI3j/gxWf0i5izrzW5MvOfNui5o1HPUSb5N7YlRloOGKw0TpaO5v/gfNZvOOC719idpY8GnKr0Np35KexO0seDTlV6G078lMA09TeUx0DUmnS9Kk87tiXloYhQ2+tqsmzRzXMov1jlRdCQ4Z5c1v9Gax+kW1vYnaWPBpyq9Dad+SnsTtLHg05VehtO/JTANVdtH0J/Dn92ax+kTto+hP4c/uzWP0i2r7E7Sx4NOVXobTvyU9idpY8GnKr0Np35KYBqrto+hP4c/uzWP0i5/1669dJ2dOk7HOWeWma38ZxJWf4Z6ikv4FUpfsvYqlKxon8yNLshttDhPd3The1hckA9q+xO0seDTlV6G078lPYnaWPBpyq9Dad+SmANJ3esZN/J/h7q6Atqr8lJpNKoFKkqFQqZKU6m06XhyknJykFsGBLQIbQ2HChw2gNYxrQGhoAAAAC/WpAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREB//2Q==";

  function loadSignature() {
    return new Promise(resolve => {
      if (signatureInput.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
          signatureBase64 = e.target.result;
          resolve();
        };
        reader.readAsDataURL(signatureInput.files[0]);
      } else resolve();
    });
  }

  loadSignature().then(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.addImage(logoBase64, "PNG", 10, 8, 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(39, 174, 96);
    doc.text("AVEREST ELECTRO SYSTEMS", 105, 15, { align: "center" });
    doc.setTextColor(52, 152, 219);
    doc.text("Importers & Distributors of Cash Registers, Electronic weighing Machines", 105, 21, { align: "center" });
    doc.text("No: 97, Ambagamuwa Road, Nawalapitiya, Sri Lanka", 105, 27, { align: "center" });
    doc.text("Tel: 077-3614999, 077-7204842, 071-2004842", 105, 33, { align: "center" });
    doc.text("Email: averest123@yahoo.com", 105, 39, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Reference ID: ${refId}`, 10, 45);
    doc.text(`Date: ${date} 02:13 PM +0530`, 150, 45);
    doc.text(`Address: ${address}, ${customerName}`, 10, 51);

    doc.setFontSize(14);
    doc.setTextColor(46, 62, 80);
    doc.text("Repair Quotation", 105, 58, { align: "center" });

    doc.autoTable({
      startY: 65,
      head: [['Serial No', 'Description', 'Unit Price (LKR)', 'Total Price (LKR)']],
      body: Array.from(document.querySelectorAll(".item")).map(item => [
        item.querySelector(".serial").value || "N/A",
        item.querySelector(".desc").value || "N/A",
        parseFloat(item.querySelector(".unit").value || 0).toFixed(2),
        parseFloat(item.querySelector(".total").value || 0).toFixed(2),
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.2,
        lineColor: [44, 62, 80],
        fillColor: [236, 240, 241]
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontSize: 12
      },
      margin: { left: 10, right: 10 },
    });

    const finalY = doc.lastAutoTable.finalY || 65;
    doc.setFontSize(12);
    doc.setTextColor(231, 76, 60);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${calculateTotal().toFixed(2)} LKR`, 10, finalY + 10);

    let y = finalY + 20;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("TERMS AND CONDITIONS:", 10, y);
    y += 5;
    doc.text("1. *Payment Terms:* 100% against commercial invoice.", 10, y);
    y += 5;
    doc.text("2. *Transport facilities* aren’t included in the above mentioned prices.", 10, y);
    y += 10;
    doc.text("Bank details:", 10, y);
    y += 5;
    doc.text(`Bank: ${bank}`, 10, y);
    y += 5;
    doc.text(`Branch: ${branch}`, 10, y);
    y += 5;
    doc.text(`Account Name: ${accountName}`, 10, y);
    y += 5;
    doc.text(`Account Number: ${accountNumber}`, 10, y);
    y += 10;
    doc.text("Please don’t hesitate to contact me for any further clarifications.", 10, y);
    y += 5;
    doc.text("Thank you,", 10, y);
    y += 10;
    doc.text(senderName, 10, y);
    y += 5;
    doc.text(senderPhone, 10, y);
    y += 5;
    doc.text(senderTitle, 10, y);
    y += 5;
    doc.text("Averest Electro Systems", 10, y);

    y += 10;
    if (signatureBase64) {
      doc.addImage(signatureBase64, "PNG", 5, y, 50, 20);
    } else {
      doc.setFontSize(12);
      doc.text("____________________", 10, y);
    }

    doc.setFillColor(240, 240, 240);
    doc.rect(0, 280, 210, 30, 'F');
    doc.setTextColor(149, 165, 166);
    doc.text("CONFIDENTIAL DOCUMENT - Averest Electro Systems", 105, 290, { align: "center" });

    doc.save(`quotation_${refId || 'no-id'}.pdf`);
  });
}
s