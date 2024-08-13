<?php

display_page_banner_subtitle();
    ?>

    <div class="container container--narrow page-section">
        

      <div class="generic-content">
        <div class="row group">
            <div class="one-third">
            <?php the_post_thumbnail('professorPortrait'); ?>
            </div>
            <div class="two-thirds">

            <?php 
            //Query to count likes
            $likeCount = new WP_Query(array(
              'post_type' => 'like',
              'meta_query' => array(
                array(
                  'key' => 'liked_professor_id',
                  'compare' => '=',
                  'value' => get_the_ID()
                )
              )
            ));

            
            //Check if the user has liked this professor:
            $existStatus = 'no';

            if (is_user_logged_in()) {
              $existQuery = new WP_Query(array(
                'author' => get_current_user_id(),
                'post_type' => 'like',
                'meta_query' => array(
                  array(
                    'key' => 'liked_professor_id',
                    'compare' => '=',
                    'value' => get_the_ID()
                  )
                )
              ));

              if ($existQuery->found_posts) {
                $existStatus = 'yes';
              }
            }
            
            ?>

            <span class="like-box" data-like="<?php if (isset($existQuery->posts[0]->ID)) echo $existQuery->posts[0]->ID; ?>" data-professor="<?php the_ID(); ?>"  data-exists="<?php echo $existStatus; ?>">
              <i class="fa-regular fa-heart fa-heart-o "></i>
              <i class="fa-solid fa-heart"></i>
              <!-- $likeCount->found_posts this will get the value if it exits for these case it will give 1 for meowsalot and 0 for barksalot as we have created like taxonomy for only meowsalot id -->
                <span class="like-count"><?php echo $likeCount->found_posts; ?></span> 
              </span>
            <?php the_content(); ?>
            </div>
        </div>
      </div>

      <?php 
        $relatedPrograms = get_field('related_programs');
        if(!empty($relatedPrograms)){
          echo '<hr class="section-break" >';
          echo '<h2 class="headline headline--medium">Subject(s)</h2>';
          echo '<ul class="link-list link-list--horizontal">';
          foreach ($relatedPrograms as $program){ ?>
  
            <li><a href="<?php echo get_the_permalink($program); ?>" ><?php echo get_the_title($program); ?></a></li>
  
        <?php  }
         echo '</ul>';
        }
       
      ?>

    </div>