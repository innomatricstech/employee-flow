  import React from 'react'
  import { 
    HiUsers, 
    HiClock, 
    HiCheckCircle, 
    HiTrendingUp,
    HiCalendar,
    HiChartBar 
  } from 'react-icons/hi'

  const Dashboard = () => {
    const stats = [
      { 
        title: 'Total Employees', 
        value: '142', 
        change: '+12%', 
        icon: <HiUsers />, 
        color: 'blue',
        bgColor: 'bg-blue-50'
      },
      { 
        title: 'Active Today', 
        value: '124', 
        change: '+8%', 
        icon: <HiCheckCircle />, 
        color: 'green',
        bgColor: 'bg-green-50'
      },
      { 
        title: 'Avg. Work Hours', 
        value: '8.2', 
        change: '+0.5', 
        icon: <HiClock />, 
        color: 'purple',
        bgColor: 'bg-purple-50'
      },
      { 
        title: 'Productivity', 
        value: '92%', 
        change: '+3%', 
        icon: <HiTrendingUp />, 
        color: 'orange',
        bgColor: 'bg-orange-50'
      },
    ]

    const recentActivities = [
      { employee: 'John Doe', action: 'Logged in', time: '08:30 AM', status: 'present' },
      { employee: 'Jane Smith', action: 'Submitted work log', time: '05:45 PM', status: 'completed' },
      { employee: 'Bob Johnson', action: 'Started Project X', time: '09:15 AM', status: 'working' },
      { employee: 'Alice Brown', action: 'Paused work', time: '01:30 PM', status: 'paused' },
      { employee: 'Mike Wilson', action: 'Logged out', time: '06:00 PM', status: 'completed' },
    ]

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`text-${stat.color}-600 text-2xl`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-${stat.color}-600 font-medium`}>
                  {stat.change}
                </span>
                <span className="text-gray-500 text-sm ml-2">from yesterday</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productivity Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Productivity Overview</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Details →
              </button>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <HiChartBar className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">Productivity chart visualization</p>
                <p className="text-sm text-gray-400 mt-2">(Chart component would go here)</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                See All →
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'present' ? 'bg-green-500' :
                      activity.status === 'working' ? 'bg-blue-500' :
                      activity.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-medium">{activity.employee}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{activity.time}</p>
                    <p className={`text-xs capitalize ${
                      activity.status === 'present' ? 'text-green-600' :
                      activity.status === 'working' ? 'text-blue-600' :
                      activity.status === 'paused' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
            <div className="flex items-center gap-2">
              <HiCalendar className="text-gray-400" />
              <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Team Meeting', 'Project Review', 'Training Session'].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                  <div>
                    <h4 className="font-medium">{item}</h4>
                    <p className="text-sm text-gray-600">
                      {index === 0 ? '10:00 AM - 11:00 AM' :
                      index === 1 ? '02:00 PM - 03:00 PM' : '04:00 PM - 05:00 PM'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  export default Dashboard