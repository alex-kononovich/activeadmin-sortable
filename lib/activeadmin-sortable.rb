require 'activeadmin-sortable/version'
require 'activeadmin'
require 'rails/engine'

module ActiveAdmin
  module Sortable
    module ControllerActions
      def sortable(scope = nil)

        config.sort_order = "position_asc"

        if scope
          filter scope

          sidebar :sorting, only: :index do
            "To sort #{resource_class.to_s.pluralize.downcase}, filter by #{scope} fist &#x2191;".html_safe 
          end

          controller do
            # dirty, dirty hack
            resource_class.class_variable_set :@@search_scope, scope

            helper_method :scope_active?
            def scope_active? name
              unless params["#{name}_id"].nil?
                true
              else
                search_params = clean_search_params params[:q]
                search_params.keys.include?("#{name}_id_eq")
              end
            end
          end
        end

        member_action :sort, :method => :post do
          if defined?(::Mongoid::Orderable) &&
            resource.class.included_modules.include?(::Mongoid::Orderable)
              resource.move_to! params[:position].to_i
          else
            resource.insert_at params[:position].to_i
          end
          head 200
        end
      end
    end

    module TableMethods
      HANDLE = '&#x2195;'.html_safe

      def sortable_handle_column
        if resource_class.class_variable_defined? :@@search_scope
          scope = resource_class.class_variable_get :@@search_scope
          return if scope and not scope_active?(scope)
        end

        column '', :class => "activeadmin-sortable" do |resource|
          sort_url = resource_path(resource) + "/sort"

          if defined?(::Mongoid::Orderable) &&
            resource.class.included_modules.include?(::Mongoid::Orderable)
              position_column = resource.orderable_column
          else
            position_column = resource.position_column
          end

          content_tag :span, HANDLE, :class => 'handle', 'data-sort-url' => sort_url, 'data-position' => resource.send(position_column)
        end
      end
    end

    ::ActiveAdmin::ResourceDSL.send(:include, ControllerActions)
    ::ActiveAdmin::Views::TableFor.send(:include, TableMethods)

    class Engine < ::Rails::Engine
      # Including an Engine tells Rails that this gem contains assets
    end
  end
end


