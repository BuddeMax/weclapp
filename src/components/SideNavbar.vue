<template>
  <div class="wrapper">
    <!-- Sidebar  -->
    <nav id="sidebar" :class="{ 'active': isExpanded }">
      <div class="sidebar-header">
        <h3>My Person App</h3>
        <strong>MPA</strong>
      </div>

      <ul class="list-unstyled components">
        <li>
          <router-link to="/">
            <i class="fas fa-home"></i>
            Home
          </router-link>
        </li>
        <li>
          <router-link to="/about">
            <i class="fas fa-briefcase"></i>
            About
          </router-link>
        </li>
        <li>
          <router-link to="/patient">
            <i class="fas fa-user"></i>
            Patient
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Page Content  -->
    <div id="content">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <button type="button" id="sidebarCollapse" class="btn btn-info" @click="toggleSidebar">
            <i class="fas fa-align-left"></i>
            <span>Toggle Sidebar</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideNavBar',
  data() {
    return {
      isExpanded: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
    }
  }
};
</script>

<style scoped>
#sidebar.active {
  min-width: 80px;
  max-width: 80px;
  text-align: center;
}

#sidebar .sidebar-header strong {
  display: none;
}
#sidebar.active .sidebar-header h3 {
  display: none;
}
#sidebar.active .sidebar-header strong {
  display: block;
}

#sidebar ul li a {
  text-align: left;
}

#sidebar.active ul li a {
  padding: 20px 10px;
  text-align: center;
  font-size: 0.85em;
}

#sidebar.active ul li a i {
  margin-right: 0;
  display: block;
  font-size: 1.8em;
  margin-bottom: 5px;
}

#sidebar.active ul ul a {
  padding: 10px !important;
}

#sidebar.active .dropdown-toggle::after {
  top: auto;
  bottom: 10px;
  right: 50%;
  -webkit-transform: translateX(50%);
  -ms-transform: translateX(50%);
  transform: translateX(50%);
}
</style>
