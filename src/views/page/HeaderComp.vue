<template>
  <div class="header">
    <div class="logo">
      <div class="logo-image">
        <img src="@/assets/images/MoaCook2.png" alt="MoaCook Logo" @click="test()">
      </div>
    </div>
    <div class="menu">
      <div class="search-form">
        <input type="text" class="search-input" placeholder="통합검색">
        <button class="search-button" @click="onclick">
          <img class="search-icon" src="@/assets/images/search.png" alt="Search Icon">
        </button>
      </div>
      <ul class="menu-list">
        <li class="menu-item">로그인</li>
        <li class="menu-item">회원가입</li>
      </ul>
    </div>
    <nav class="nav">
      <ul class="nav-list">
        <li>
          <button @click="KoreaFood()">한식 조리법</button>
        </li>
        <li>
          <button>중식 조리법</button>
        </li>
        <li>
          <button>일식 조리법</button>
        </li>
        <li>
          <button>양식 조리법</button>
        </li>
        <li>
          <button>비건 조리법</button>
        </li>
      </ul>
    </nav>
    <hr>
  </div>
  <hr class="divider">
</template>

<script>
export default {
  methods: {
    test() {
      console.log("this");
      console.log(this.$route);
      this.$router.push({
        path: "/test"
      });
    },
    KoreaFood(){
      this.$router.push({
        path : '/menu/koreafood'
      })
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  height: 16vh;
  justify-content: space-between;
  align-items: center;
  padding: 1vh 1vw 0;
}

.logo {
  width: 30vw;
  margin-left: -5vw;
}
.logo-image {
  width: 14vw;
  left: 16vw;
  margin-top: 3vh;
  padding-bottom: 40%;
  position: relative;
  overflow: hidden;
}

.logo img {
  position: absolute;
  top: -1vh;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.menu {
  position: absolute;
  left: 40vw;
  width: 80vw;
}

.menu-list {
  position: absolute;
  list-style: none;
  display: flex;
  right: 40vw;
  top: -7vh;
}

.menu-item {
  font-size: 0.9vw; 
  font-weight: 500;
  color: #7F879E;
  margin-right: 2vw; 
}

.search-form {
  position: absolute;
  display: flex;
  align-items: center;
  top: -7vh;
  left: -3vw; 
  width: 100%;
}

.search-input {
  width: 30%;
  max-width: 28vw; 
  height: 4vh; 
  padding-left: 1vw; 
  border: 0.1vw solid #7F879E; 
  border-radius: 2vw; 
  outline: none;
  font-size: 0.8vw; 
}

.search-button {
  position: absolute;
  width: 1.9vw; 
  height: 1.9vw; 
  left: 22.7vw; 
  border: 0.1vw solid #FFBD59; 
  border-radius: 2vw; 
  background-color: #FFBD59;
  cursor: pointer;
  outline: none;
}

.search-icon {
  width: 90%; 
  height: auto; 
}

.nav-list {
  position: absolute;
  list-style: none;
  display: flex;
  margin-top: 2vh; 
  margin-right: 2vw;
}

.nav-list button{
  background-color: white;
  border: none;
  font-size: 1.1vw;
  font-weight: bold;
  margin-left: 3vw;
}

.nav-list button:hover{
  color: #FFBD59;
  cursor: pointer;
}

.nav-list a{
  text-decoration: none;
  color: black;
}

.nav-list a:hover{
  color: #FFBD59;
  cursor: pointer;
}

.divider {
  height: 0.2vh; 
  background-color: #FFBD59;
  border: 0;
  margin-top: 0.2vh; 
}


@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 5vh 5vw 0;
  }

  .menu-list {
    margin-top: 2vh;
  }

  .search-form {
    margin-top: 2vh;
    width: 100%;
  }

  .search-input {
    font-size: 4vw; 
  }

  .search-button {
    margin-left: 0;
    margin-top: 2vh;
  }

  .nav-list {
    margin-top: 4vh;
    flex-direction: column;
    align-items: center;
  }

  .nav-list li {
    margin-right: 0;
    margin-bottom: 2vh;
  }
}
</style>