<template>
  <div>
    <div @mouseup="mouseUp" @touchend="mouseUp">
      <canvas :width="width" :height="height" id="sketchpad" :style="'background-size: ' + width + 'px ' + height + 'px;'">
      </canvas>
    </div>
    <v-btn
      color="white"
      v-for="country in ((found_countries.length > 10 && show_all == false) ? found_countries.slice(0, 10) : found_countries)"
      @click="remove(country)"
      >
      {{country}}<small><v-icon>close</v-icon></small>
    </v-btn>
    <v-btn dark v-if="found_countries.length > 10" @click="show_all = !show_all">{{show_all ? 'minimise' : 'show all'}}</v-btn>
    <div v-if="found_countries.length == 0">
      <div class="black--text">
        <small>...or don't and I'll search from the whole world)</small>
      </div>
      <v-btn color="white">everywhere 🌍</v-btn>
    </div>
  </div>
</template>

<script>
export default {
    name: 'location-map',
    props: ['type', 'tooltip'],
    data () {
      return {
        show_all: false,
        width: 500,
        canvas: null,
        ctx: null,
        size_param: 6,
        mouseX: 0,
        mouseY: 0,
        mouseDown:0,
        touchX: null,
        touchY: null,
        lastX: -1,
        lastY: -1,
        found_countries: [],
        map: [ { "place": "adak", "x": 192, "y": 97 }, { "place": "united states", "x": 180, "y": 251 }, { "place": "apia", "x": 988, "y": 369 }, { "place": "samoa", "x": 990, "y": 405 }, { "place": "pago pago", "x": 986, "y": 392 }, { "place": "alofi", "x": 706, "y": 410 }, { "place": "niue", "x": 705, "y": 407 }, { "place": "avarua", "x": 993, "y": 408 }, { "place": "cook islands", "x": 993, "y": 408 }, { "place": "honolulu", "x": 12, "y": 280 }, { "place": "hilo", "x": 10, "y": 247 }, { "place": "anchorage", "x": 105, "y": 181 }, { "place": "papeete", "x": 991, "y": 387 }, { "place": "french polynesia", "x": 991, "y": 387 }, { "place": "fairbanks", "x": 106, "y": 156 }, { "place": "sitka", "x": 119, "y": 197 }, { "place": "whitehorse", "x": 129, "y": 180 }, { "place": "canada", "x": 193, "y": 199 }, { "place": "juneau", "x": 122, "y": 208 }, { "place": "adamstown", "x": 7, "y": 469 }, { "place": "vancouver", "x": 128, "y": 221 }, { "place": "portland", "x": 136, "y": 243 }, { "place": "san francisco", "x": 135, "y": 263 }, { "place": "seattle", "x": 132, "y": 236 }, { "place": "sacramento", "x": 143, "y": 247 }, { "place": "los angeles", "x": 150, "y": 282 }, { "place": "riverside", "x": 154, "y": 279 }, { "place": "san diego", "x": 158, "y": 289 }, { "place": "tijuana", "x": 167, "y": 301 }, { "place": "mexico", "x": 180, "y": 319 }, { "place": "mexicali", "x": 169, "y": 301 }, { "place": "las vegas", "x": 163, "y": 267 }, { "place": "yellowknife", "x": 171, "y": 170 }, { "place": "calgary", "x": 156, "y": 222 }, { "place": "edmonton", "x": 162, "y": 204 }, { "place": "phoenix", "x": 174, "y": 275 }, { "place": "salt lake city", "x": 167, "y": 259 }, { "place": "tucson", "x": 181, "y": 284 }, { "place": "hanga roa", "x": 59, "y": 453 }, { "place": "chile", "x": 236, "y": 488 }, { "place": "saskatoon", "x": 175, "y": 204 }, { "place": "albuquerque", "x": 185, "y": 276 }, { "place": "el paso", "x": 186, "y": 293 }, { "place": "chihuahua", "x": 182, "y": 301 }, { "place": "denver", "x": 183, "y": 263 }, { "place": "durango", "x": 180, "y": 264 }, { "place": "regina", "x": 183, "y": 205 }, { "place": "zapopan", "x": 182, "y": 330 }, { "place": "guadalajara", "x": 183, "y": 330 }, { "place": "monterrey", "x": 187, "y": 307 }, { "place": "mexico city", "x": 191, "y": 325 }, { "place": "san antonio", "x": 202, "y": 277 }, { "place": "puebla", "x": 196, "y": 325 }, { "place": "austin", "x": 194, "y": 279 }, { "place": "oklahoma city", "x": 198, "y": 263 }, { "place": "wichita", "x": 202, "y": 241 }, { "place": "winnipeg", "x": 206, "y": 208 }, { "place": "dallas", "x": 207, "y": 271 }, { "place": "veracruz", "x": 209, "y": 329 }, { "place": "houston", "x": 212, "y": 293 }, { "place": "kansas city", "x": 210, "y": 268 }, { "place": "minneapolis", "x": 213, "y": 247 }, { "place": "quetzaltenango", "x": 208, "y": 336 }, { "place": "guatemala", "x": 212, "y": 339 }, { "place": "guatemala city", "x": 214, "y": 343 }, { "place": "new orleans", "x": 223, "y": 294 }, { "place": "memphis", "x": 221, "y": 270 }, { "place": "mérida", "x": 208, "y": 326 }, { "place": "san salvador", "x": 219, "y": 349 }, { "place": "el salvador", "x": 219, "y": 349 }, { "place": "belmopan", "x": 222, "y": 340 }, { "place": "belize", "x": 222, "y": 340 }, { "place": "belize city", "x": 220, "y": 339 }, { "place": "milwaukee", "x": 220, "y": 244 }, { "place": "chicago", "x": 221, "y": 252 }, { "place": "tegucigalpa", "x": 221, "y": 346 }, { "place": "honduras", "x": 221, "y": 346 }, { "place": "nashville", "x": 229, "y": 262 }, { "place": "managua", "x": 222, "y": 343 }, { "place": "nicaragua", "x": 222, "y": 343 }, { "place": "indianapolis", "x": 229, "y": 257 }, { "place": "louisville", "x": 228, "y": 266 }, { "place": "cincinnati", "x": 230, "y": 248 }, { "place": "atlanta", "x": 229, "y": 274 }, { "place": "san josé", "x": 219, "y": 346 }, { "place": "costa rica", "x": 219, "y": 346 }, { "place": "detroit", "x": 232, "y": 240 }, { "place": "columbus", "x": 235, "y": 259 }, { "place": "tampa", "x": 242, "y": 291 }, { "place": "havana", "x": 241, "y": 314 }, { "place": "cuba", "x": 241, "y": 314 }, { "place": "cleveland", "x": 237, "y": 247 }, { "place": "jacksonville", "x": 244, "y": 283 }, { "place": "george town", "x": 249, "y": 266 }, { "place": "malaysia", "x": 769, "y": 312 }, { "place": "charlotte", "x": 240, "y": 265 }, { "place": "miami", "x": 242, "y": 295 }, { "place": "pittsburgh", "x": 243, "y": 235 }, { "place": "guayaquil", "x": 223, "y": 372 }, { "place": "ecuador", "x": 223, "y": 372 }, { "place": "panama city", "x": 227, "y": 349 }, { "place": "toronto", "x": 240, "y": 232 }, { "place": "buffalo", "x": 234, "y": 246 }, { "place": "raleigh", "x": 240, "y": 278 }, { "place": "quito", "x": 226, "y": 364 }, { "place": "rochester", "x": 235, "y": 250 }, { "place": "nassau", "x": 258, "y": 306 }, { "place": "the bahamas", "x": 260, "y": 307 }, { "place": "washington", "x": 245, "y": 257 }, { "place": "lima", "x": 233, "y": 410 }, { "place": "peru", "x": 233, "y": 410 }, { "place": "kingston", "x": 254, "y": 318 }, { "place": "jamaica", "x": 251, "y": 318 }, { "place": "baltimore", "x": 244, "y": 259 }, { "place": "colombia", "x": 243, "y": 355 }, { "place": "virginia beach", "x": 251, "y": 253 }, { "place": "ottawa", "x": 252, "y": 222 }, { "place": "medellín", "x": 246, "y": 359 }, { "place": "cartagena", "x": 239, "y": 342 }, { "place": "philadelphia", "x": 250, "y": 250 }, { "place": "barranquilla", "x": 244, "y": 342 }, { "place": "forked river", "x": 250, "y": 262 }, { "place": "jersey city", "x": 248, "y": 245 }, { "place": "bogotá", "x": 245, "y": 360 }, { "place": "montreal", "x": 248, "y": 234 }, { "place": "iquitos", "x": 242, "y": 389 }, { "place": "valdivia", "x": 236, "y": 510 }, { "place": "concepción", "x": 235, "y": 495 }, { "place": "cusco", "x": 245, "y": 406 }, { "place": "maracaibo", "x": 254, "y": 339 }, { "place": "venezuela", "x": 276, "y": 357 }, { "place": "valparaíso", "x": 235, "y": 485 }, { "place": "arequipa", "x": 252, "y": 413 }, { "place": "providence", "x": 281, "y": 215 }, { "place": "la serena", "x": 235, "y": 488 }, { "place": "cockburn town", "x": 298, "y": 306 }, { "place": "turks and caicos islands", "x": 293, "y": 306 }, { "place": "boston", "x": 261, "y": 232 }, { "place": "punta arenas", "x": 240, "y": 537 }, { "place": "santiago", "x": 241, "y": 490 }, { "place": "antofagasta", "x": 234, "y": 480 }, { "place": "iquique", "x": 241, "y": 449 }, { "place": "oranjestad", "x": 263, "y": 326 }, { "place": "aruba", "x": 263, "y": 326 }, { "place": "santo domingo", "x": 292, "y": 309 }, { "place": "dominican republic", "x": 287, "y": 309 }, { "place": "rio branco", "x": 266, "y": 405 }, { "place": "brazil", "x": 299, "y": 400 }, { "place": "willemstad", "x": 267, "y": 330 }, { "place": "netherlands antilles", "x": 267, "y": 330 }, { "place": "calama", "x": 242, "y": 484 }, { "place": "mendoza", "x": 247, "y": 491 }, { "place": "argentina", "x": 255, "y": 493 }, { "place": "iqaluit", "x": 294, "y": 178 }, { "place": "ushuaia", "x": 244, "y": 539 }, { "place": "la paz", "x": 252, "y": 442 }, { "place": "bolivia", "x": 259, "y": 442 }, { "place": "puerto williams", "x": 244, "y": 535 }, { "place": "caracas", "x": 261, "y": 338 }, { "place": "fredericton", "x": 299, "y": 205 }, { "place": "san juan", "x": 304, "y": 322 }, { "place": "puerto rico", "x": 304, "y": 322 }, { "place": "saint john", "x": 306, "y": 205 }, { "place": "grenada", "x": 302, "y": 331 }, { "place": "sucre", "x": 263, "y": 449 }, { "place": "charlotte amalie", "x": 287, "y": 312 }, { "place": "hamilton", "x": 896, "y": 453 }, { "place": "bermuda", "x": 289, "y": 280 }, { "place": "road town", "x": 294, "y": 299 }, { "place": "british virgin islands", "x": 302, "y": 299 }, { "place": "córdoba", "x": 259, "y": 479 }, { "place": "porto velho", "x": 271, "y": 395 }, { "place": "charlottetown", "x": 295, "y": 198 }, { "place": "the valley", "x": 224, "y": 274 }, { "place": "anguilla", "x": 310, "y": 335 }, { "place": "basse-terre", "x": 301, "y": 309 }, { "place": "guadeloupe", "x": 301, "y": 309 }, { "place": "bahía blanca", "x": 288, "y": 469 }, { "place": "st. john's", "x": 311, "y": 195 }, { "place": "san fernando", "x": 146, "y": 272 }, { "place": "trinidad and tobago", "x": 280, "y": 336 }, { "place": "roseau", "x": 289, "y": 323 }, { "place": "chaguanas", "x": 287, "y": 335 }, { "place": "kingstown", "x": 265, "y": 227 }, { "place": "saint vincent and the grenadines", "x": 314, "y": 320 }, { "place": "castries", "x": 297, "y": 329 }, { "place": "st. lucia", "x": 309, "y": 315 }, { "place": "rosario", "x": 262, "y": 490 }, { "place": "boa vista", "x": 402, "y": 310 }, { "place": "manaus", "x": 283, "y": 377 }, { "place": "bridgetown", "x": 302, "y": 332 }, { "place": "barbados", "x": 309, "y": 332 }, { "place": "buenos aires", "x": 298, "y": 462 }, { "place": "stanley", "x": 240, "y": 270 }, { "place": "hong kong", "x": 746, "y": 240 }, { "place": "asunción", "x": 286, "y": 431 }, { "place": "paraguay", "x": 286, "y": 431 }, { "place": "saint-pierre", "x": 287, "y": 150 }, { "place": "réunion", "x": 650, "y": 414 }, { "place": "montevideo", "x": 296, "y": 465 }, { "place": "uruguay", "x": 294, "y": 461 }, { "place": "cuiabá", "x": 292, "y": 423 }, { "place": "paramaribo", "x": 284, "y": 351 }, { "place": "suriname", "x": 284, "y": 355 }, { "place": "campo grande", "x": 279, "y": 416 }, { "place": "chuí", "x": 300, "y": 460 }, { "place": "pelotas", "x": 293, "y": 466 }, { "place": "cayenne", "x": 295, "y": 358 }, { "place": "french guiana", "x": 295, "y": 363 }, { "place": "nuuk", "x": 322, "y": 111 }, { "place": "greenland", "x": 334, "y": 70 }, { "place": "porto alegre", "x": 299, "y": 436 }, { "place": "macapá", "x": 304, "y": 368 }, { "place": "assis", "x": 299, "y": 411 }, { "place": "italy", "x": 507, "y": 235 }, { "place": "curitiba", "x": 308, "y": 387 }, { "place": "belém", "x": 311, "y": 398 }, { "place": "brasília", "x": 311, "y": 398 }, { "place": "campinas", "x": 319, "y": 386 }, { "place": "são paulo", "x": 322, "y": 418 }, { "place": "vitória", "x": 335, "y": 410 }, { "place": "ilhéus", "x": 345, "y": 394 }, { "place": "fortaleza", "x": 336, "y": 379 }, { "place": "maceió", "x": 344, "y": 398 }, { "place": "recife", "x": 339, "y": 384 }, { "place": "ponta delgada", "x": 341, "y": 389 }, { "place": "portugal", "x": 431, "y": 236 }, { "place": "praia", "x": 409, "y": 297 }, { "place": "reykjavík", "x": 395, "y": 128 }, { "place": "iceland", "x": 395, "y": 128 }, { "place": "dakar", "x": 434, "y": 318 }, { "place": "senegal", "x": 442, "y": 314 }, { "place": "thiès", "x": 439, "y": 315 }, { "place": "serekunda", "x": 439, "y": 327 }, { "place": "the gambia", "x": 441, "y": 325 }, { "place": "brikama", "x": 441, "y": 322 }, { "place": "banjul", "x": 446, "y": 330 }, { "place": "nouakchott", "x": 452, "y": 328 }, { "place": "mauritania", "x": 451, "y": 284 }, { "place": "bissau", "x": 460, "y": 344 }, { "place": "guinea-bissau", "x": 472, "y": 343 }, { "place": "conakry", "x": 458, "y": 337 }, { "place": "freetown", "x": 460, "y": 351 }, { "place": "sierra leone", "x": 480, "y": 348 }, { "place": "el aaiún", "x": 476, "y": 347 }, { "place": "western sahara", "x": 451, "y": 276 }, { "place": "monrovia", "x": 450, "y": 343 }, { "place": "liberia", "x": 459, "y": 341 }, { "place": "lisbon", "x": 431, "y": 238 }, { "place": "bamako", "x": 466, "y": 331 }, { "place": "casablanca", "x": 452, "y": 277 }, { "place": "morocco", "x": 457, "y": 281 }, { "place": "koulikoro", "x": 462, "y": 319 }, { "place": "rabat", "x": 462, "y": 321 }, { "place": "tórshavn", "x": 461, "y": 304 }, { "place": "faroe islands", "x": 475, "y": 383 }, { "place": "dublin", "x": 442, "y": 178 }, { "place": "ireland", "x": 445, "y": 182 }, { "place": "seville", "x": 453, "y": 227 }, { "place": "spain", "x": 440, "y": 234 }, { "place": "belfast", "x": 443, "y": 182 }, { "place": "united kingdom", "x": 452, "y": 174 }, { "place": "jamestown", "x": 536, "y": 461 }, { "place": "gibraltar", "x": 460, "y": 239 }, { "place": "yamoussoukro", "x": 475, "y": 342 }, { "place": "côte d'ivoire", "x": 477, "y": 346 }, { "place": "douglas", "x": 445, "y": 173 }, { "place": "australia", "x": 818, "y": 421 }, { "place": "málaga", "x": 442, "y": 240 }, { "place": "glasgow", "x": 452, "y": 165 }, { "place": "abidjan", "x": 461, "y": 274 }, { "place": "madrid", "x": 438, "y": 231 }, { "place": "cardiff", "x": 448, "y": 178 }, { "place": "edinburgh", "x": 457, "y": 162 }, { "place": "timbuktu", "x": 480, "y": 312 }, { "place": "liverpool", "x": 453, "y": 173 }, { "place": "bilbao", "x": 443, "y": 226 }, { "place": "manchester", "x": 457, "y": 175 }, { "place": "aberdeen", "x": 456, "y": 163 }, { "place": "birmingham", "x": 455, "y": 172 }, { "place": "leeds", "x": 455, "y": 175 }, { "place": "nantes", "x": 457, "y": 219 }, { "place": "france", "x": 466, "y": 218 }, { "place": "ouagadougou", "x": 486, "y": 332 }, { "place": "burkina faso", "x": 483, "y": 329 }, { "place": "tamale", "x": 495, "y": 328 }, { "place": "ghana", "x": 495, "y": 339 }, { "place": "valencia", "x": 442, "y": 238 }, { "place": "accra", "x": 444, "y": 232 }, { "place": "london", "x": 455, "y": 176 }, { "place": "greenwich", "x": 453, "y": 172 }, { "place": "lomé", "x": 462, "y": 221 }, { "place": "togo", "x": 487, "y": 348 }, { "place": "toulouse", "x": 494, "y": 351 }, { "place": "ibiza", "x": 450, "y": 244 }, { "place": "niamey", "x": 462, "y": 225 }, { "place": "niger", "x": 490, "y": 347 }, { "place": "barcelona", "x": 438, "y": 230 }, { "place": "paris", "x": 458, "y": 218 }, { "place": "cotonou", "x": 496, "y": 354 }, { "place": "benin", "x": 490, "y": 348 }, { "place": "porto-novo", "x": 501, "y": 349 }, { "place": "palma", "x": 451, "y": 244 }, { "place": "algiers", "x": 486, "y": 273 }, { "place": "algeria", "x": 481, "y": 278 }, { "place": "lagos", "x": 509, "y": 348 }, { "place": "nigeria", "x": 512, "y": 345 }, { "place": "ibadan", "x": 504, "y": 347 }, { "place": "the hague", "x": 470, "y": 190 }, { "place": "brussels", "x": 469, "y": 198 }, { "place": "belgium", "x": 467, "y": 195 }, { "place": "antwerp", "x": 474, "y": 190 }, { "place": "rotterdam", "x": 482, "y": 187 }, { "place": "lyon", "x": 480, "y": 211 }, { "place": "amsterdam", "x": 478, "y": 189 }, { "place": "marseille", "x": 470, "y": 215 }, { "place": "bergen", "x": 487, "y": 204 }, { "place": "norway", "x": 477, "y": 132 }, { "place": "geneva", "x": 484, "y": 216 }, { "place": "switzerland", "x": 488, "y": 213 }, { "place": "são tomé", "x": 504, "y": 373 }, { "place": "düsseldorf", "x": 488, "y": 203 }, { "place": "germany", "x": 485, "y": 199 }, { "place": "cologne", "x": 479, "y": 203 }, { "place": "cannes", "x": 471, "y": 211 }, { "place": "nice", "x": 475, "y": 228 }, { "place": "monaco", "x": 481, "y": 231 }, { "place": "bern", "x": 486, "y": 203 }, { "place": "abuja", "x": 522, "y": 405 }, { "place": "enugu", "x": 523, "y": 420 }, { "place": "turin", "x": 525, "y": 380 }, { "place": "strasbourg", "x": 478, "y": 212 }, { "place": "kano", "x": 519, "y": 339 }, { "place": "zürich", "x": 491, "y": 199 }, { "place": "frankfurt", "x": 495, "y": 198 }, { "place": "malabo", "x": 523, "y": 332 }, { "place": "philippines", "x": 781, "y": 285 }, { "place": "stuttgart", "x": 481, "y": 189 }, { "place": "milan", "x": 495, "y": 237 }, { "place": "libreville", "x": 490, "y": 223 }, { "place": "gabon", "x": 522, "y": 383 }, { "place": "vaduz", "x": 521, "y": 388 }, { "place": "liechtenstein", "x": 496, "y": 194 }, { "place": "douala", "x": 528, "y": 384 }, { "place": "cameroon", "x": 526, "y": 364 }, { "place": "hanover", "x": 480, "y": 187 }, { "place": "hamburg", "x": 483, "y": 195 }, { "place": "tunis", "x": 513, "y": 254 }, { "place": "tunisia", "x": 513, "y": 259 }, { "place": "aarhus", "x": 485, "y": 174 }, { "place": "denmark", "x": 479, "y": 172 }, { "place": "oslo", "x": 488, "y": 131 }, { "place": "innsbruck", "x": 499, "y": 218 }, { "place": "austria", "x": 506, "y": 216 }, { "place": "yaoundé", "x": 522, "y": 364 }, { "place": "munich", "x": 497, "y": 193 }, { "place": "gothenburg", "x": 500, "y": 196 }, { "place": "sweden", "x": 501, "y": 118 }, { "place": "leipzig", "x": 496, "y": 197 }, { "place": "rome", "x": 495, "y": 238 }, { "place": "copenhagen", "x": 498, "y": 173 }, { "place": "malmö", "x": 493, "y": 143 }, { "place": "salzburg", "x": 495, "y": 126 }, { "place": "tripoli", "x": 503, "y": 240 }, { "place": "libya", "x": 524, "y": 281 }, { "place": "luanda", "x": 518, "y": 408 }, { "place": "angola", "x": 522, "y": 413 }, { "place": "berlin", "x": 501, "y": 196 }, { "place": "dresden", "x": 490, "y": 198 }, { "place": "naples", "x": 491, "y": 235 }, { "place": "linz", "x": 494, "y": 206 }, { "place": "prague", "x": 508, "y": 208 }, { "place": "czech republic", "x": 509, "y": 210 }, { "place": "sabha", "x": 526, "y": 418 }, { "place": "birkirkara", "x": 495, "y": 249 }, { "place": "malta", "x": 497, "y": 249 }, { "place": "ljubljana", "x": 501, "y": 218 }, { "place": "slovenia", "x": 507, "y": 214 }, { "place": "valletta", "x": 505, "y": 229 }, { "place": "n'djamena", "x": 531, "y": 425 }, { "place": "chad", "x": 542, "y": 330 }, { "place": "brazzaville", "x": 545, "y": 408 }, { "place": "republic of the congo", "x": 545, "y": 400 }, { "place": "kinshasa", "x": 558, "y": 404 }, { "place": "democratic republic of the congo", "x": 558, "y": 403 }, { "place": "graz", "x": 617, "y": 405 }, { "place": "longyearbyen", "x": 492, "y": 77 }, { "place": "svalbard and jan mayen", "x": 480, "y": 57 }, { "place": "zagreb", "x": 514, "y": 220 }, { "place": "croatia", "x": 516, "y": 226 }, { "place": "vienna", "x": 523, "y": 222 }, { "place": "bratislava", "x": 523, "y": 223 }, { "place": "slovakia", "x": 525, "y": 219 }, { "place": "stockholm", "x": 508, "y": 121 }, { "place": "sarajevo", "x": 520, "y": 215 }, { "place": "bosnia and herzegovina", "x": 520, "y": 216 }, { "place": "cape town", "x": 547, "y": 478 }, { "place": "south africa", "x": 551, "y": 458 }, { "place": "bangui", "x": 553, "y": 414 }, { "place": "central african republic", "x": 554, "y": 396 }, { "place": "budapest", "x": 516, "y": 205 }, { "place": "hungary", "x": 518, "y": 207 }, { "place": "podgorica", "x": 546, "y": 222 }, { "place": "montenegro", "x": 543, "y": 225 }, { "place": "tirana", "x": 547, "y": 227 }, { "place": "albania", "x": 553, "y": 230 }, { "place": "kraków", "x": 555, "y": 225 }, { "place": "poland", "x": 506, "y": 182 }, { "place": "belgrade", "x": 521, "y": 206 }, { "place": "serbia", "x": 522, "y": 210 }, { "place": "kaliningrad", "x": 522, "y": 175 }, { "place": "russia", "x": 664, "y": 133 }, { "place": "warsaw", "x": 516, "y": 192 }, { "place": "pristina", "x": 542, "y": 217 }, { "place": "kosovo", "x": 540, "y": 209 }, { "place": "skopje", "x": 532, "y": 196 }, { "place": "macedonia", "x": 543, "y": 226 }, { "place": "sofia", "x": 541, "y": 224 }, { "place": "bulgaria", "x": 550, "y": 214 }, { "place": "athens", "x": 542, "y": 239 }, { "place": "greece", "x": 538, "y": 237 }, { "place": "tampere", "x": 514, "y": 125 }, { "place": "finland", "x": 523, "y": 131 }, { "place": "lviv", "x": 548, "y": 224 }, { "place": "ukraine", "x": 547, "y": 217 }, { "place": "riga", "x": 546, "y": 214 }, { "place": "latvia", "x": 548, "y": 209 }, { "place": "espoo", "x": 545, "y": 200 }, { "place": "tallinn", "x": 544, "y": 201 }, { "place": "estonia", "x": 549, "y": 204 }, { "place": "helsinki", "x": 521, "y": 128 }, { "place": "vilnius", "x": 541, "y": 204 }, { "place": "lithuania", "x": 541, "y": 208 }, { "place": "port elizabeth", "x": 558, "y": 467 }, { "place": "livingstone", "x": 557, "y": 463 }, { "place": "zambia", "x": 550, "y": 423 }, { "place": "gaborone", "x": 541, "y": 418 }, { "place": "botswana", "x": 561, "y": 413 }, { "place": "bucharest", "x": 563, "y": 223 }, { "place": "romania", "x": 562, "y": 222 }, { "place": "bloemfontein", "x": 553, "y": 452 }, { "place": "tartu", "x": 562, "y": 428 }, { "place": "syria", "x": 557, "y": 225 }, { "place": "lubumbashi", "x": 558, "y": 224 }, { "place": "maseru", "x": 559, "y": 222 }, { "place": "lesotho", "x": 564, "y": 455 }, { "place": "francistown", "x": 565, "y": 460 }, { "place": "minsk", "x": 550, "y": 208 }, { "place": "belarus", "x": 553, "y": 216 }, { "place": "johannesburg", "x": 567, "y": 449 }, { "place": "pretoria", "x": 568, "y": 445 }, { "place": "lusaka", "x": 575, "y": 440 }, { "place": "ndola", "x": 573, "y": 427 }, { "place": "bulawayo", "x": 569, "y": 342 }, { "place": "zimbabwe", "x": 562, "y": 423 }, { "place": "istanbul", "x": 562, "y": 204 }, { "place": "turkey", "x": 561, "y": 219 }, { "place": "bursa", "x": 560, "y": 212 }, { "place": "bujumbura", "x": 571, "y": 386 }, { "place": "burundi", "x": 569, "y": 377 }, { "place": "tiraspol", "x": 556, "y": 221 }, { "place": "moldova", "x": 559, "y": 220 }, { "place": "alexandria", "x": 555, "y": 272 }, { "place": "egypt", "x": 552, "y": 284 }, { "place": "kigali", "x": 568, "y": 377 }, { "place": "rwanda", "x": 568, "y": 384 }, { "place": "saint petersburg", "x": 545, "y": 171 }, { "place": "odessa", "x": 555, "y": 229 }, { "place": "harare", "x": 571, "y": 409 }, { "place": "durban", "x": 572, "y": 461 }, { "place": "mbabane", "x": 573, "y": 416 }, { "place": "swaziland", "x": 582, "y": 444 }, { "place": "lobamba", "x": 584, "y": 437 }, { "place": "cairo", "x": 564, "y": 293 }, { "place": "manzini", "x": 566, "y": 342 }, { "place": "port said", "x": 581, "y": 430 }, { "place": "konya", "x": 582, "y": 422 }, { "place": "omdurman", "x": 579, "y": 405 }, { "place": "sudan", "x": 570, "y": 287 }, { "place": "khartoum", "x": 563, "y": 319 }, { "place": "suez", "x": 569, "y": 326 }, { "place": "maputo", "x": 569, "y": 354 }, { "place": "mozambique", "x": 573, "y": 383 }, { "place": "luxor", "x": 576, "y": 378 }, { "place": "ankara", "x": 577, "y": 392 }, { "place": "mwanza", "x": 575, "y": 404 }, { "place": "tanzania", "x": 599, "y": 403 }, { "place": "murmansk", "x": 593, "y": 389 }, { "place": "nicosia", "x": 599, "y": 369 }, { "place": "cyprus", "x": 561, "y": 246 }, { "place": "lilongwe", "x": 617, "y": 360 }, { "place": "malawi", "x": 616, "y": 359 }, { "place": "simferopol", "x": 558, "y": 233 }, { "place": "gaza", "x": 562, "y": 265 }, { "place": "palestine", "x": 562, "y": 268 }, { "place": "mersin", "x": 573, "y": 238 }, { "place": "tel aviv", "x": 558, "y": 264 }, { "place": "israel", "x": 559, "y": 263 }, { "place": "blantyre", "x": 595, "y": 394 }, { "place": "jerusalem", "x": 569, "y": 267 }, { "place": "adana", "x": 554, "y": 221 }, { "place": "beirut", "x": 578, "y": 253 }, { "place": "lebanon", "x": 578, "y": 254 }, { "place": "dodoma", "x": 608, "y": 365 }, { "place": "amman", "x": 579, "y": 270 }, { "place": "jordan", "x": 589, "y": 289 }, { "place": "damascus", "x": 575, "y": 246 }, { "place": "kharkiv", "x": 573, "y": 204 }, { "place": "nairobi", "x": 592, "y": 394 }, { "place": "kenya", "x": 592, "y": 400 }, { "place": "gaziantep", "x": 585, "y": 129 }, { "place": "moscow", "x": 557, "y": 161 }, { "place": "addis ababa", "x": 614, "y": 345 }, { "place": "ethiopia", "x": 618, "y": 340 }, { "place": "asmara", "x": 616, "y": 348 }, { "place": "eritrea", "x": 593, "y": 331 }, { "place": "jeddah", "x": 588, "y": 328 }, { "place": "saudi arabia", "x": 590, "y": 278 }, { "place": "zanzibar city", "x": 589, "y": 329 }, { "place": "medina", "x": 585, "y": 319 }, { "place": "mecca", "x": 573, "y": 268 }, { "place": "sukhumi", "x": 574, "y": 231 }, { "place": "georgia", "x": 573, "y": 232 }, { "place": "moroni", "x": 574, "y": 229 }, { "place": "comoros", "x": 576, "y": 234 }, { "place": "baghdad", "x": 609, "y": 235 }, { "place": "iraq", "x": 619, "y": 235 }, { "place": "hargeisa", "x": 620, "y": 239 }, { "place": "somalia", "x": 624, "y": 334 }, { "place": "yerevan", "x": 623, "y": 221 }, { "place": "armenia", "x": 607, "y": 211 }, { "place": "tbilisi", "x": 612, "y": 210 }, { "place": "mamoudzou", "x": 624, "y": 334 }, { "place": "mayotte", "x": 626, "y": 211 }, { "place": "mogadishu", "x": 614, "y": 333 }, { "place": "tabriz", "x": 608, "y": 185 }, { "place": "riyadh", "x": 651, "y": 236 }, { "place": "stepanakert", "x": 618, "y": 200 }, { "place": "azerbaijan", "x": 622, "y": 196 }, { "place": "antananarivo", "x": 620, "y": 201 }, { "place": "madagascar", "x": 624, "y": 402 }, { "place": "basra", "x": 635, "y": 231 }, { "place": "baku", "x": 635, "y": 237 }, { "place": "dammam", "x": 643, "y": 238 }, { "place": "samara", "x": 645, "y": 246 }, { "place": "manama", "x": 649, "y": 245 }, { "place": "bahrain", "x": 606, "y": 264 }, { "place": "tehran", "x": 623, "y": 235 }, { "place": "doha", "x": 634, "y": 250 }, { "place": "qatar", "x": 603, "y": 268 }, { "place": "abu dhabi", "x": 604, "y": 266 }, { "place": "united arab emirates", "x": 609, "y": 267 }, { "place": "dubai", "x": 613, "y": 270 }, { "place": "saint-denis", "x": 622, "y": 187 }, { "place": "perm", "x": 621, "y": 143 }, { "place": "port louis", "x": 645, "y": 157 }, { "place": "mauritius", "x": 632, "y": 407 }, { "place": "ashgabat", "x": 651, "y": 247 }, { "place": "turkmenistan", "x": 630, "y": 198 }, { "place": "muscat", "x": 654, "y": 150 }, { "place": "nukus", "x": 650, "y": 209 }, { "place": "uzbekistan", "x": 608, "y": 181 }, { "place": "mashhad", "x": 610, "y": 211 }, { "place": "yekaterinburg", "x": 613, "y": 143 }, { "place": "kandahar", "x": 619, "y": 175 }, { "place": "afghanistan", "x": 625, "y": 226 }, { "place": "karachi", "x": 625, "y": 222 }, { "place": "pakistan", "x": 631, "y": 239 }, { "place": "hyderabad", "x": 626, "y": 242 }, { "place": "dushanbe", "x": 644, "y": 210 }, { "place": "tajikistan", "x": 645, "y": 202 }, { "place": "kabul", "x": 644, "y": 210 }, { "place": "tashkent", "x": 636, "y": 205 }, { "place": "astana", "x": 635, "y": 184 }, { "place": "kazakhstan", "x": 642, "y": 184 }, { "place": "multan", "x": 650, "y": 184 }, { "place": "peshawar", "x": 649, "y": 168 }, { "place": "namangan", "x": 655, "y": 178 }, { "place": "ahmedabad", "x": 666, "y": 260 }, { "place": "mumbai", "x": 666, "y": 276 }, { "place": "surat", "x": 672, "y": 277 }, { "place": "faisalabad", "x": 680, "y": 256 }, { "place": "rawalpindi", "x": 665, "y": 253 }, { "place": "islamabad", "x": 680, "y": 246 }, { "place": "omsk", "x": 672, "y": 247 }, { "place": "pune", "x": 681, "y": 256 }, { "place": "lahore", "x": 677, "y": 263 }, { "place": "bishkek", "x": 693, "y": 265 }, { "place": "kyrgyzstan", "x": 663, "y": 168 }, { "place": "srinagar", "x": 718, "y": 272 }, { "place": "amritsar", "x": 720, "y": 282 }, { "place": "jaipur", "x": 733, "y": 287 }, { "place": "ludhiana", "x": 736, "y": 284 }, { "place": "almaty", "x": 666, "y": 267 }, { "place": "new delhi", "x": 681, "y": 270 }, { "place": "bangalore", "x": 684, "y": 276 }, { "place": "nagpur", "x": 686, "y": 260 }, { "place": "colombo", "x": 658, "y": 237 }, { "place": "sri lanka", "x": 676, "y": 298 }, { "place": "chennai", "x": 724, "y": 274 }, { "place": "kanpur", "x": 726, "y": 274 }, { "place": "kandy", "x": 720, "y": 266 }, { "place": "lucknow", "x": 723, "y": 261 }, { "place": "batticaloa", "x": 742, "y": 287 }, { "place": "novosibirsk", "x": 701, "y": 154 }, { "place": "patna", "x": 702, "y": 262 }, { "place": "kathmandu", "x": 697, "y": 150 }, { "place": "nepal", "x": 668, "y": 202 }, { "place": "ürümqi", "x": 715, "y": 244 }, { "place": "china", "x": 719, "y": 198 }, { "place": "norilsk", "x": 725, "y": 148 }, { "place": "gangtok", "x": 721, "y": 186 }, { "place": "shigatse", "x": 735, "y": 191 }, { "place": "thimphu", "x": 755, "y": 188 }, { "place": "bhutan", "x": 739, "y": 224 }, { "place": "dhaka", "x": 749, "y": 232 }, { "place": "bangladesh", "x": 698, "y": 266 }, { "place": "lhasa", "x": 704, "y": 253 }, { "place": "agartala", "x": 706, "y": 253 }, { "place": "guwahati", "x": 705, "y": 268 }, { "place": "chittagong", "x": 712, "y": 270 }, { "place": "shillong", "x": 711, "y": 249 }, { "place": "port blair", "x": 710, "y": 256 }, { "place": "dibrugarh", "x": 724, "y": 258 }, { "place": "banda aceh", "x": 724, "y": 268 }, { "place": "indonesia", "x": 734, "y": 274 }, { "place": "yangon", "x": 775, "y": 310 }, { "place": "myanmar", "x": 782, "y": 319 }, { "place": "medan", "x": 787, "y": 310 }, { "place": "chiang mai", "x": 771, "y": 306 }, { "place": "thailand", "x": 753, "y": 311 }, { "place": "surat thani", "x": 771, "y": 315 }, { "place": "padang", "x": 762, "y": 304 }, { "place": "hat yai", "x": 772, "y": 307 }, { "place": "bangkok", "x": 768, "y": 314 }, { "place": "pattaya", "x": 744, "y": 293 }, { "place": "ipoh", "x": 763, "y": 299 }, { "place": "pekanbaru", "x": 731, "y": 285 }, { "place": "bratsk", "x": 741, "y": 291 }, { "place": "kuala lumpur", "x": 774, "y": 316 }, { "place": "xining", "x": 776, "y": 322 }, { "place": "nakhon ratchasima", "x": 772, "y": 327 }, { "place": "kota bharu", "x": 778, "y": 329 }, { "place": "vientiane", "x": 732, "y": 276 }, { "place": "laos", "x": 743, "y": 280 }, { "place": "kunming", "x": 748, "y": 289 }, { "place": "udon thani", "x": 749, "y": 283 }, { "place": "johor bahru", "x": 759, "y": 291 }, { "place": "lanzhou", "x": 766, "y": 302 }, { "place": "singapore", "x": 778, "y": 314 }, { "place": "siem reap", "x": 770, "y": 314 }, { "place": "cambodia", "x": 770, "y": 306 }, { "place": "chengdu", "x": 734, "y": 283 }, { "place": "palembang", "x": 743, "y": 265 }, { "place": "phnom penh", "x": 735, "y": 251 }, { "place": "hanoi", "x": 746, "y": 255 }, { "place": "vietnam", "x": 718, "y": 224 }, { "place": "chongqing", "x": 726, "y": 227 }, { "place": "hai phong", "x": 733, "y": 248 }, { "place": "ho chi minh city", "x": 721, "y": 215 }, { "place": "jakarta", "x": 721, "y": 236 }, { "place": "bogor", "x": 733, "y": 243 }, { "place": "ulan bator", "x": 744, "y": 228 }, { "place": "mongolia", "x": 744, "y": 208 }, { "place": "bandung", "x": 727, "y": 201 }, { "place": "da nang", "x": 729, "y": 207 }, { "place": "nanning", "x": 742, "y": 207 }, { "place": "pontianak", "x": 743, "y": 234 }, { "place": "kuching", "x": 725, "y": 245 }, { "place": "semarang", "x": 748, "y": 244 }, { "place": "taiyuan", "x": 744, "y": 234 }, { "place": "malang", "x": 759, "y": 236 }, { "place": "surabaya", "x": 749, "y": 239 }, { "place": "guangzhou", "x": 769, "y": 193 }, { "place": "macau", "x": 772, "y": 190 }, { "place": "zhengzhou", "x": 775, "y": 181 }, { "place": "dongguan", "x": 773, "y": 189 }, { "place": "miri", "x": 776, "y": 189 }, { "place": "shenzhen", "x": 779, "y": 179 }, { "place": "wuhan", "x": 770, "y": 179 }, { "place": "handan", "x": 772, "y": 182 }, { "place": "shijiazhuang", "x": 781, "y": 184 }, { "place": "bandar seri begawan", "x": 788, "y": 186 }, { "place": "brunei", "x": 794, "y": 177 }, { "place": "denpasar", "x": 788, "y": 177 }, { "place": "mandurah", "x": 780, "y": 195 }, { "place": "perth", "x": 767, "y": 426 }, { "place": "kota kinabalu", "x": 790, "y": 279 }, { "place": "beijing", "x": 789, "y": 184 }, { "place": "balikpapan", "x": 799, "y": 304 }, { "place": "jinan", "x": 760, "y": 187 }, { "place": "tianjin", "x": 768, "y": 191 }, { "place": "port hedland", "x": 758, "y": 136 }, { "place": "nanjing", "x": 764, "y": 198 }, { "place": "makassar", "x": 773, "y": 200 }, { "place": "hangzhou", "x": 771, "y": 191 }, { "place": "kaohsiung", "x": 788, "y": 189 }, { "place": "taiwan", "x": 798, "y": 216 }, { "place": "qingdao", "x": 770, "y": 190 }, { "place": "taichung", "x": 777, "y": 185 }, { "place": "manila", "x": 787, "y": 194 }, { "place": "quezon city", "x": 790, "y": 183 }, { "place": "shanghai", "x": 788, "y": 185 }, { "place": "taipei", "x": 789, "y": 186 }, { "place": "dalian", "x": 791, "y": 178 }, { "place": "iloilo city", "x": 802, "y": 177 }, { "place": "zamboanga city", "x": 800, "y": 183 }, { "place": "shenyang", "x": 794, "y": 177 }, { "place": "tagbilaran", "x": 794, "y": 177 }, { "place": "cebu city", "x": 795, "y": 176 }, { "place": "changchun", "x": 795, "y": 176 }, { "place": "dili", "x": 777, "y": 180 }, { "place": "pyongyang", "x": 827, "y": 162 }, { "place": "north korea", "x": 827, "y": 160 }, { "place": "davao city", "x": 826, "y": 162 }, { "place": "kaesong", "x": 827, "y": 171 }, { "place": "harbin", "x": 827, "y": 171 }, { "place": "incheon", "x": 827, "y": 173 }, { "place": "south korea", "x": 830, "y": 172 }, { "place": "seoul", "x": 830, "y": 174 }, { "place": "wonsan", "x": 830, "y": 175 }, { "place": "okinawa", "x": 833, "y": 181 }, { "place": "japan", "x": 853, "y": 183 }, { "place": "ambon", "x": 858, "y": 177 }, { "place": "daegu", "x": 812, "y": 323 }, { "place": "busan", "x": 742, "y": 277 }, { "place": "yakutsk", "x": 805, "y": 130 }, { "place": "chongjin", "x": 854, "y": 181 }, { "place": "fukuoka", "x": 851, "y": 183 }, { "place": "darwin", "x": 792, "y": 125 }, { "place": "vladivostok", "x": 854, "y": 127 }, { "place": "hiroshima", "x": 865, "y": 190 }, { "place": "melekeok", "x": 861, "y": 204 }, { "place": "palau", "x": 833, "y": 333 }, { "place": "kobe", "x": 858, "y": 223 }, { "place": "osaka", "x": 859, "y": 216 }, { "place": "kyoto", "x": 860, "y": 209 }, { "place": "nagoya", "x": 858, "y": 209 }, { "place": "adelaide", "x": 870, "y": 429 }, { "place": "yokohama", "x": 875, "y": 224 }, { "place": "kawasaki", "x": 869, "y": 219 }, { "place": "jayapura", "x": 869, "y": 225 }, { "place": "sapporo", "x": 869, "y": 227 }, { "place": "geelong", "x": 871, "y": 212 }, { "place": "hagåtña", "x": 873, "y": 209 }, { "place": "dededo", "x": 869, "y": 427 }, { "place": "melbourne", "x": 869, "y": 446 }, { "place": "saipan", "x": 905, "y": 214 }, { "place": "cairns", "x": 853, "y": 396 }, { "place": "townsville", "x": 856, "y": 399 }, { "place": "port moresby", "x": 868, "y": 416 }, { "place": "papua new guinea", "x": 947, "y": 428 }, { "place": "hobart", "x": 898, "y": 454 }, { "place": "canberra", "x": 892, "y": 472 }, { "place": "rockhampton", "x": 869, "y": 419 }, { "place": "magadan", "x": 873, "y": 439 }, { "place": "wollongong", "x": 876, "y": 443 }, { "place": "sydney", "x": 842, "y": 455 }, { "place": "newcastle", "x": 847, "y": 448 }, { "place": "weno", "x": 864, "y": 434 }, { "place": "federated states of micronesia", "x": 931, "y": 426 }, { "place": "brisbane", "x": 942, "y": 418 }, { "place": "gold coast", "x": 874, "y": 440 }, { "place": "palikir", "x": 953, "y": 431 }, { "place": "honiara", "x": 942, "y": 423 }, { "place": "solomon islands", "x": 952, "y": 419 }, { "place": "nouméa", "x": 959, "y": 428 }, { "place": "new caledonia", "x": 967, "y": 440 }, { "place": "invercargill", "x": 967, "y": 440 }, { "place": "new zealand", "x": 902, "y": 461 }, { "place": "dunedin", "x": 896, "y": 460 }, { "place": "majuro", "x": 930, "y": 459 }, { "place": "marshall islands", "x": 965, "y": 430 }, { "place": "christchurch", "x": 939, "y": 410 }, { "place": "wellington", "x": 956, "y": 403 }, { "place": "auckland", "x": 896, "y": 459 }, { "place": "suva", "x": 935, "y": 407 }, { "place": "fiji", "x": 958, "y": 407 }, { "place": "funafuti", "x": 934, "y": 375 }, { "place": "tuvalu", "x": 935, "y": 365 }, { "place": "labasa", "x": 914, "y": 365 }, { "place": "nukuʻalofa", "x": 919, "y": 364 }, { "place": "tonga", "x": 932, "y": 381 }, { "place": "rabi island", "x": 940, "y": 359 }, { "place": "st. louis", "x": 913, "y": 347 }, { "place": "santiago de cuba", "x": 914, "y": 373 }, { "place": "new york city", "x": 253, "y": 237 }, { "place": "port-au-prince", "x": 924, "y": 389 }, { "place": "haiti", "x": 931, "y": 395 }, { "place": "san carlos de bariloche", "x": 937, "y": 376 }, { "place": "quebec city", "x": 240, "y": 218 }, { "place": "city of halifax", "x": 300, "y": 200 }, { "place": "santa cruz de la sierra", "x": 309, "y": 388 }, { "place": "st. george's", "x": 433, "y": 236 }, { "place": "port of spain", "x": 437, "y": 244 }, { "place": "fort-de-france", "x": 454, "y": 232 }, { "place": "martinique", "x": 463, "y": 228 }, { "place": "ciudad del este", "x": 446, "y": 236 }, { "place": "são josé dos campos", "x": 318, "y": 402 }, { "place": "rio de janeiro", "x": 338, "y": 398 }, { "place": "horta (azores)", "x": 336, "y": 385 }, { "place": "angra do heroísmo", "x": 305, "y": 391 }, { "place": "santa cruz de tenerife", "x": 310, "y": 378 }, { "place": "las palmas de gran canaria", "x": 314, "y": 381 }, { "place": "cork (city)", "x": 451, "y": 178 }, { "place": "marrakech", "x": 454, "y": 278 }, { "place": "andorra la vella", "x": 439, "y": 233 }, { "place": "luxembourg (city)", "x": 490, "y": 208 }, { "place": "city of san marino", "x": 191, "y": 319 }, { "place": "vatican city", "x": 495, "y": 213 }, { "place": "split (city)", "x": 513, "y": 217 }, { "place": "gdańsk", "x": 575, "y": 196 }, { "place": "thessaloniki", "x": 536, "y": 237 }, { "place": "izmir", "x": 550, "y": 224 }, { "place": "chişinău", "x": 621, "y": 225 }, { "place": "kiev", "x": 545, "y": 205 }, { "place": "dar es salaam", "x": 586, "y": 269 }, { "place": "djibouti (city)", "x": 607, "y": 224 }, { "place": "tskhinvali", "x": 636, "y": 247 }, { "place": "sana'a", "x": 643, "y": 242 }, { "place": "yemen", "x": 647, "y": 226 }, { "place": "nizhny novgorod", "x": 614, "y": 145 }, { "place": "arbil", "x": 636, "y": 238 }, { "place": "kuwait city", "x": 581, "y": 301 }, { "place": "malé", "x": 658, "y": 306 }, { "place": "republic of maldives", "x": 657, "y": 307 }, { "place": "sri jayawardenapura-kotte", "x": 675, "y": 264 }, { "place": "kolkata", "x": 684, "y": 258 }, { "place": "naypyidaw", "x": 705, "y": 264 }, { "place": "phuket (city)", "x": 725, "y": 281 }, { "place": "alor star", "x": 742, "y": 289 }, { "place": "malacca town", "x": 767, "y": 301 }, { "place": "huế", "x": 752, "y": 295 }, { "place": "xi'an", "x": 753, "y": 296 }, { "place": "yogyakarta (city)", "x": 736, "y": 238 }, { "place": "makati city", "x": 736, "y": 244 }, { "place": "koror", "x": 737, "y": 237 }, { "place": "republic of palau", "x": 731, "y": 293 }, { "place": "tokyo", "x": 846, "y": 194 }, { "place": "petropavlovsk-kamchatsky", "x": 861, "y": 145 }, { "place": "yaren district", "x": 863, "y": 133 }, { "place": "nauru", "x": 853, "y": 202 }, { "place": "port vila", "x": 865, "y": 412 }, { "place": "vanuatu", "x": 897, "y": 390 }, { "place": "south tarawa", "x": 917, "y": 398 }, { "place": "mata-utu", "x": 922, "y": 388 }, { "place": "wallis and futuna", "x": 916, "y": 366 }, { "place": "anadyr (town)", "x": 890, "y": 368 }, { "place": "nukulaelae", "x": 929, "y": 400 } ]
      }
    },
    mounted: function() {
      if (window.screen.availWidth > 600) {
        this.width = 600
      } else {
        this.width = window.screen.availWidth
      }
      this.init()
    },
    computed: {
      height: function() {
        return Math.floor(0.567*this.width)
      },
      resized_map: function() {
        var new_map = []
        for (let place of this.map) {
          new_map.push({
            place: place.place,
            x: Math.round((this.width/1000)*place.x),
            y: Math.round((this.height/567)*place.y)
          })
        }
        return new_map
      }
    },
    methods: {
      remove: function(country) {
        var index = this.found_countries.indexOf(country);
        if (index > -1) {
          this.found_countries.splice(index, 1);
        }
      },
      drawLine: function(ctx,x,y,size) {

          // If lastX is not set, set lastX and lastY to the current position
          if (this.lastX==-1) {
              this.lastX=x;
        this.lastY=y;
          }

          // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
          var r=0;
          var g=0;
          var b=0;
          var a=255;

          // Select a fill style
          ctx.strokeStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";

          // Set the line "cap" style to round, so lines at different angles can join into each other
          ctx.lineCap = "round";
          //ctx.lineJoin = "round";

          // Draw a filled line
          ctx.beginPath();

        // First, move to the old (previous) position
        ctx.moveTo(this.lastX,this.lastY);

        // Now draw a line to the current touch/pointer position
        ctx.lineTo(x,y);

            // Set the line thickness and draw the line
            ctx.lineWidth = size;
            ctx.stroke();

            ctx.closePath();

        // Update the last position to reference the current position
        this.lastX=x;
        this.lastY=y;
      },
      clearCanvas: function(canvas,ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      },
      sketchpad_mouseDown: function() {
          this.mouseDown=1;
          this.drawLine(this.ctx,this.mouseX,this.mouseY,this.size_param);
      },
      sketchpad_mouseUp: function() {
          this.mouseDown=0;

          // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
          this.lastX=-1;
          this.lastY=-1;
      },
      sketchpad_mouseMove: function(e) {
          // Update the mouse co-ordinates when moved
          this.getMousePos(e);

          // Draw a dot if the mouse button is currently being pressed
          if (this.mouseDown==1) {
              this.drawLine(this.ctx,this.mouseX,this.mouseY,this.size_param);
          }
      },
      getMousePos: function(e) {
          if (!e)
              var e = event;

          if (e.offsetX) {
              this.mouseX = e.offsetX;
              this.mouseY = e.offsetY;
          }
          else if (e.layerX) {
              this.mouseX = e.layerX;
              this.mouseY = e.layerY;
          }
       },
      sketchpad_touchStart: function() {
          // Update the touch co-ordinates
          this.getTouchPos();

          this.drawLine(this.ctx,this.touchX,this.touchY,this.size_param);

          // Prevents an additional mousedown event being triggered
          event.preventDefault();
      },
      sketchpad_touchEnd: function() {
          // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
          this.lastX=-1;
          this.lastY=-1;
      },
      sketchpad_touchMove: function(e) {
          // Update the touch co-ordinates
          this.getTouchPos(e);

          // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
          this.drawLine(this.ctx,this.touchX,this.touchY,this.size_param);

          // Prevent a scrolling action as a result of this touchmove triggering.
          event.preventDefault();
      },
      getTouchPos: function(e) {
          if (!e)
              var e = event;

          if(e.touches) {
              if (e.touches.length == 1) { // Only deal with one finger
                  var touch = e.touches[0]; // Get the information for finger #1
                  this.touchX=touch.pageX-touch.target.offsetLeft;
                  this.touchY=touch.pageY-touch.target.offsetTop;
              }
          }
      },
      init: function() {
          // Get the specific canvas element from the HTML document
          this.canvas = document.getElementById('sketchpad');

          // If the browser supports the canvas tag, get the 2d drawing context for this canvas
          if (this.canvas.getContext)
              this.ctx = this.canvas.getContext('2d');

          // Check that we have a valid context to draw on/with before adding event handlers
          if (this.ctx) {
              // React to mouse events on the canvas, and mouseup on the entire document
              this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown, false);
              this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove, false);
              window.addEventListener('mouseup', this.sketchpad_mouseUp, false);

              // React to touch events on the canvas
              this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false);
              this.canvas.addEventListener('touchend', this.sketchpad_touchEnd, false);
              this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false);
          }

          //ctx.fillStyle = "blue";
          //ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      mouseUp: function() {
        this.draw_circle()
      },
      draw_circle: function() {
        var canvas = document.getElementById("sketchpad")
        var context = canvas.getContext('2d')
        var imgData = context.getImageData(0,0,canvas.width,canvas.height);
        var data = imgData.data;
        var i = 0
        var rows = []
        for (var y = 0; y < canvas.height; y++) {
          var blank_space = false
          var init_black_read = false
          var done_row = false
          for (var x = 0; x < canvas.width; x++) {
            var red = data[i];
            var green = data[i+1];
            var blue = data[i+2];
            var alpha = data[i+3];
            if (!done_row) {
              if (((red == 0) && (green == 0)) && ((blue == 0) && (alpha == 0))) {
                if (init_black_read == true) {
                  blank_space = true
                }
              } else {
                //black
                init_black_read = true
                if (blank_space == true) {
                  rows.push(y)
                  done_row = true
                }
              }
            }
            i += 4
          }
        }
        this.found_countries = []
        var i = 0
        for (var y = 0; y < canvas.height; y++) {
          blank_space = false
          init_black_read = false
          done_row = false
          for (var x = 0; x < canvas.width; x++) {
            if (rows.includes(y)) {
              var red = data[i];
              var green = data[i+1];
              var blue = data[i+2];
              var alpha = data[i+3];
              if (!done_row) {
                if (((red == 0) && (green == 0)) && ((blue == 0) && (alpha == 0))) {
                  if (init_black_read == true) {
                    blank_space = true
                    for (let place of this.resized_map) {
                      if ((place.x == x) && (place.y == y)) {
                        this.found_countries.push(place.place)
                      }
                    }
                  }
                } else {
                  //black
                  init_black_read = true
                  if (blank_space == true) {
                    done_row = true
                  }
                }
              }
            }
            i += 4
          }
        }
        this.$emit('change-locations', this.found_countries)
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
}
</script>

<style scoped>
/* Some CSS styling */
#app {
    /* Prevent nearby text being highlighted when accidentally dragging mouse outside confines of the canvas */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
#sketchpad {
    position:relative; /* Necessary for correct mouse co-ords in Firefox */
}
canvas {
  background: url('../assets/map.png');
}
</style>
