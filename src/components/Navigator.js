import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import "./Navigator.scss";

class MenuGroup extends Component {
  render() {
    const { name, children } = this.props;
    return (
      <li className="menu-group">
        <div className="menu-group-name">
          <FormattedMessage id={name} />
        </div>
        <ul className="menu-list list-unstyled">{children}</ul>
      </li>
    );
  }
}

class Menu extends Component {
  render() {
    const { name, active, link, children, onClick, hasSubMenu, onLinkClick } =
      this.props;
    return (
      <li
        className={
          "menu" +
          (hasSubMenu ? " has-sub-menu" : "") +
          "" +
          (active ? " active" : "")
        }
      >
        {hasSubMenu ? (
          <Fragment>
            <span
              data-toggle="collapse"
              className={"menu-link collapsed"}
              onClick={onClick}
              aria-expanded={"false"}
            >
              <FormattedMessage id={name} />
              <div className="icon-right">
                <i className={"far fa-angle-right"} />
              </div>
            </span>
            <div>
              <ul className="sub-menu-list list-unstyled">{children}</ul>
            </div>
          </Fragment>
        ) : (
          <Link to={link} className="menu-link" onClick={onLinkClick}>
            <FormattedMessage id={name} />
          </Link>
        )}
      </li>
    );
  }
}

// withRouter là một HOC giúp truy cập các đối tượng history, location, match của React Router
const MenuGroupWithRouter = withRouter(MenuGroup);
const MenuWithRouter = withRouter(Menu);
const withRouterInnerRef = (WrappedComponent) => {
  //class này được sử dụng để chuyển tiếp các tham chiếu refs từ cha sang con
  class InnerComponentWithRef extends React.Component {
    render() {
      const { forwardRef, ...rest } = this.props;
      return <WrappedComponent {...rest} ref={forwardRef} />;
    }
  }

  // withRef được sử đụng để đảm bảo các tham chiếu truyền qua withRouter
  const ComponentWithRef = withRouter(InnerComponentWithRef, { withRef: true });

  //React.forwardRef được sử dụng để tạo một thành phần có thể chuyển tiếp tham
  //chiếu (ref) từ thành phần cha xuống thành phần con.
  return React.forwardRef((props, ref) => {
    return <ComponentWithRef {...props} forwardRef={ref} />;
  });
};

class Navigator extends Component {
  //Mục đích: Kiểm tra xem menu hoặc submenu có hoạt động
  //dựa trên URL hiện tại hay không.
  isMenuHasSubMenuActive = (location, subMenus, link) => {
    //Nếu có đường dẫn (link), kiểm tra xem đường dẫn của menu
    //có khớp với URL hiện tại không.
    if (link) {
      return this.props.location.pathname === link;
    }

    return false;
  };

  render() {
    const { menus, location, onLinkClick } = this.props;
    return (
      <Fragment>
        <ul className="navigator-menu list-unstyled">
          {menus.map((group, groupIndex) => {
            return (
              <Fragment key={groupIndex}>
                <MenuGroupWithRouter name={group.name}>
                  {group.menus
                    ? group.menus.map((menu, menuIndex) => {
                        const isMenuHasSubMenuActive =
                          this.isMenuHasSubMenuActive(
                            location,
                            menu.subMenus,
                            menu.link
                          );
                        return (
                          <MenuWithRouter
                            key={menuIndex}
                            active={isMenuHasSubMenuActive}
                            name={menu.name}
                            link={menu.link}
                            onLinkClick={onLinkClick}
                          ></MenuWithRouter>
                        );
                      })
                    : null}
                </MenuGroupWithRouter>
              </Fragment>
            );
          })}
        </ul>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouterInnerRef(
  connect(mapStateToProps, mapDispatchToProps)(Navigator)
);
