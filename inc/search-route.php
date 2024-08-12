<?php 

//The add_action function is used to hook into the rest_api_init action, which is triggered when the REST API is initialized. This allows us to register our custom route.
add_action('rest_api_init', 'universityRegisterSearch');


//Inside the universityRegisterSearch function, we use the register_rest_route function to define a new REST route. The first parameter is the namespace (university/v1), the second parameter is the route name (search), and the third parameter is an array of configuration options.

//Inside the configuration array, we specify the HTTP method (WP_REST_SERVER::READABLE, which means the route will respond to GET requests) and the callback function (universitySearchResults).
function universityRegisterSearch() {
    register_rest_route('university/v1', 'search', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'universitySearchResults'
    ));
}


//WP_Query is a class in WordPress that is used to retrieve posts based on specific criteria. It is a powerful tool for customizing and querying the WordPress database.

// WP_Query is a part of the WordPress Core and is used extensively in themes and plugins to display content on your website. It allows you to customize the query by passing arguments to the constructor, such as the post type, category, author, date range, and more.
function universitySearchResults($data){
   $mainQuery = new WP_Query(array(
    'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'), 
    's' => sanitize_text_field($data['term']), // s means search term
   ));

   $resultsArr = array(
    'generalInfo' => array(),
    'professors' => array(),
    'programs' => array(),
    'events' => array(),
   );

   while($mainQuery->have_posts()){
    $mainQuery->the_post();

    if(get_post_type() === 'post' || get_post_type() === 'page'){
        array_push($resultsArr['generalInfo'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink(),
            'postType' => get_post_type(),
            'authorName' => get_the_author(),
        ));
    }
    if(get_post_type() === 'professor'){
        array_push($resultsArr['professors'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink(),
            'image' => get_the_post_thumbnail_url(0, 'professorLandscape'),
        ));
    }
    if(get_post_type() === 'program'){
        array_push($resultsArr['programs'], array(
            'title' => get_the_title(),
            'permalink' => get_the_permalink(),
            'id' => get_the_id(),
        ));
    }
    if (get_post_type() == 'event') {
        $eventDate = new DateTime(get_field('event_date'));
        $description = null;
        if (has_excerpt()) {
          $description = get_the_excerpt();
        } else {
          $description = wp_trim_words(get_the_content(), 18);
        }
  
        array_push($resultsArr['events'], array(
          'title' => get_the_title(),
          'permalink' => get_the_permalink(),
          'month' => $eventDate->format('M'),
          'day' => $eventDate->format('d'),
          'description' => $description
        ));
      }

    }
    if ($resultsArr['programs']) {
        $programsMetaQuery = array('relation' => 'OR');
    
        foreach($resultsArr['programs'] as $item) {
          array_push($programsMetaQuery, array(
              'key' => 'related_programs',
              'compare' => 'LIKE',
              'value' => '"' . $item['id'] . '"'
            ));
        }
    
        $programRelationshipQuery = new WP_Query(array(
          'post_type' => array('professor', 'event'),
          'meta_query' => $programsMetaQuery
        ));
    
        while($programRelationshipQuery->have_posts()) {
          $programRelationshipQuery->the_post();

          if (get_post_type() == 'event') {
            $eventDate = new DateTime(get_field('event_date'));
            $description = null;
            if (has_excerpt()) {
              $description = get_the_excerpt();
            } else {
              $description = wp_trim_words(get_the_content(), 18);
            }
      
            array_push($resultsArr['events'], array(
              'title' => get_the_title(),
              'permalink' => get_the_permalink(),
              'month' => $eventDate->format('M'),
              'day' => $eventDate->format('d'),
              'description' => $description
            ));
          }
    
          if (get_post_type() == 'professor') {
            array_push($resultsArr['professors'], array(
              'title' => get_the_title(),
              'permalink' => get_the_permalink(),
              'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
            ));
          }
    
        }
    
        $resultsArr['professors'] = array_values(array_unique($resultsArr['professors'], SORT_REGULAR));
        $resultsArr['events'] = array_values(array_unique($resultsArr['events'], SORT_REGULAR));
      }

   return $resultsArr;
}
